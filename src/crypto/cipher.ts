import crypto from "node:crypto";

export interface RsaData {
    publicKeyModulus: string;
    publicKeyExponent: string;
    privateKeyPem: string;
}

export interface ChallengeResult {
    alea: string;
    challenge: string;
    solved: string;
    key: string;
    username: string;
}

export interface FinalKeyResult {
    solved: string;
    key: string;
}

export class PronoteCrypto {
    private static readonly ZERO_IV = Buffer.alloc(16, 0);

    /**
     * Normalises the key and IV values to Buffer format, handling hex strings and null/undefined cases.
     */
    private static toBuffer(value: string | Buffer | null | undefined, isHex = true): Buffer {
        if (!value) return PronoteCrypto.ZERO_IV;
        if (Buffer.isBuffer(value)) return value;
        return Buffer.from(value, isHex ? "hex" : "utf-8");
    }

    /**
     * Generates a new RSA key pair and extracts the modulus and exponent in hexadecimal format, along with the private key in PEM format.
     */
    static generateRSAInfos(): RsaData {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });

        // Convert the public key to JWK format to extract modulus and exponent
        const pubKeyObj = crypto.createPublicKey(publicKey);
        const jwk = pubKeyObj.export({ format: "jwk" });

        const modulus = Buffer.from(jwk.n!, "base64url").toString("hex").toUpperCase();
        const exponent = Buffer.from(jwk.e!, "base64url").toString("hex").toUpperCase();

        return {
            publicKeyModulus: modulus,
            publicKeyExponent: exponent,
            privateKeyPem: privateKey,
        };
    }

    /**
     * Decrypts data using RSA with the provided private key in PEM format.
     * If decryption fails, it falls back to returning the base64-decoded string.
     */
    static decryptRSA(base64Data: string, privateKeyPem: string): string;
    /**
     * Decrypts data using RSA with the provided private key in PEM format.
     * When asBuffer is true, returns the raw decrypted Buffer to preserve binary integrity.
     */
    static decryptRSA(base64Data: string, privateKeyPem: string, asBuffer: true): Buffer;
    static decryptRSA(base64Data: string, privateKeyPem: string, asBuffer: false): string;
    static decryptRSA(base64Data: string, privateKeyPem: string, asBuffer = false): string | Buffer {
        let resultBuffer: Buffer;

        try {
            const buffer = Buffer.from(base64Data, "base64");
            resultBuffer = crypto.privateDecrypt(
                {
                    key: privateKeyPem,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                buffer
            );
        } catch {
            resultBuffer = Buffer.from(base64Data, "base64");
        }

        return asBuffer ? resultBuffer : resultBuffer.toString("utf-8");
    }

    /**
     * Encrypts data using AES-CBC with the provided key and IV. If the IV is not provided, it defaults to a zeroed IV. The output is returned as a hexadecimal string.
     */
    static encryptAES(data: string | Buffer, key: string | Buffer, iv: string | Buffer | null = null): string {
        const keyBuf = PronoteCrypto.toBuffer(key);
        const ivBuf = PronoteCrypto.toBuffer(iv);
        const dataBuf = typeof data === "string" ? Buffer.from(data, "utf-8") : data;

        const algorithm = keyBuf.length === 32 ? "aes-256-cbc" : "aes-128-cbc";
        const cipher = crypto.createCipheriv(algorithm, keyBuf, ivBuf);

        const encrypted = Buffer.concat([cipher.update(dataBuf), cipher.final()]);
        return encrypted.toString("hex");
    }

    /**
     * Decrypts AES-encrypted data using the provided key and IV. If the IV is not provided, it defaults to a zeroed IV. The input data is expected to be in hexadecimal format, and the output is returned as a UTF-8 string.
     */
    static decryptAES(hexData: string, key: string | Buffer, iv: string | Buffer | null = null): string {
        const keyBuf = PronoteCrypto.toBuffer(key);
        const ivBuf = PronoteCrypto.toBuffer(iv);
        const dataBuf = Buffer.from(hexData, "hex");

        const algorithm = keyBuf.length === 32 ? "aes-256-cbc" : "aes-128-cbc";
        const decipher = crypto.createDecipheriv(algorithm, keyBuf, ivBuf);

        const decrypted = Buffer.concat([decipher.update(dataBuf), decipher.final()]);
        return decrypted.toString("utf-8");
    }

    /**
     * Generates the AES key based on the provided alea, username, and password using a combination of SHA-256 and MD5 hashing.
     */
    static getCle(alea: string, username: string, password: string): Buffer {
        const sha256 = crypto.createHash("sha256").update(alea + password, "utf-8").digest("hex").toUpperCase();
        return crypto.createHash("md5").update(username + sha256, "utf-8").digest();
    }

    /**
     * Decrypts the challenge sent by the server, filters out every second character, and re-encrypts the result to produce the solved challenge.
     */
    static decryptChallenge(challengeHex: string, alea: string, username: string, password: string, iv: Buffer): string {
        const key = PronoteCrypto.getCle(alea, username, password);
        const algorithm = key.length === 32 ? "aes-256-cbc" : "aes-128-cbc";

        // 1. Decrypt the challenge
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(challengeHex, "hex")),
            decipher.final(),
        ]).toString("binary");

        // 2. Filter out every second character from the decrypted string
        let filtered = "";
        for (let i = 0; i < decrypted.length; i += 2) {
            filtered += decrypted[i];
        }

        // 3. Re-encrypt the filtered string to produce the solved challenge
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const solved = Buffer.concat([
            cipher.update(Buffer.from(filtered, "utf-8")),
            cipher.final(),
        ]);

        return solved.toString("hex");
    }

    /**
     * Generates a challenge for the client to solve, including the alea, encrypted challenge, solved challenge, and the derived AES key in hexadecimal format.
     */
    static generateChallenge(username: string, password: string, ivHex: string): ChallengeResult {
        const alea = crypto.randomBytes(16).toString("hex");
        const key = PronoteCrypto.getCle(alea, username, password);
        const iv = Buffer.from(ivHex, "hex");

        const algorithm = key.length === 32 ? "aes-256-cbc" : "aes-128-cbc";
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        const challengePayload = Buffer.from(username + alea, "utf-8");
        const challengeEncrypted = Buffer.concat([
            cipher.update(challengePayload),
            cipher.final(),
        ]).toString("hex");

        const solved = PronoteCrypto.decryptChallenge(challengeEncrypted, alea, username, password, iv);

        return {
            alea,
            challenge: challengeEncrypted,
            solved,
            key: key.toString("hex"),
            username,
        };
    }

    /**
     * Generates a final key for the session by creating random bytes, formatting them as a comma-separated string, encrypting that string with AES, and returning both the solved hash and the encrypted key.
     */
    static generateFinalKey(keyHex: string, ivHex: string): FinalKeyResult {
        const randomBytes = crypto.randomBytes(16);

        // Format attendu par PRONOTE : entiers sous forme de chaîne séparée par des virgules
        const commaSeparated = Array.from(randomBytes).join(",");

        const encrypted = PronoteCrypto.encryptAES(commaSeparated, keyHex, ivHex);
        const solved = crypto.createHash("md5").update(randomBytes).digest("hex");

        return {
            solved,
            key: encrypted,
        };
    }

    /**
     * Derives an initialization vector (IV) from an encrypted UUID using RSA decryption with the provided private key in PEM format. The derived IV is generated by taking the MD5 hash of the raw decrypted bytes.
     */
    static deriveIvFromRsa(encryptedUuid: string, privateKeyPem: string): string {
        const decryptedBuffer = PronoteCrypto.decryptRSA(encryptedUuid, privateKeyPem, true);
        return crypto.createHash("md5").update(decryptedBuffer).digest("hex");
    }
}