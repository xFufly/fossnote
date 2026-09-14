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
	 * Normalise les clés ou vecteurs sous forme d'objets Buffer
	 */
	private static toBuffer(value: string | Buffer | null | undefined, isHex = true): Buffer {
		if (!value) return PronoteCrypto.ZERO_IV;
		if (Buffer.isBuffer(value)) return value;
		return Buffer.from(value, isHex ? "hex" : "utf-8");
	}

	/**
	 * Génération de la paire de clés RSA 2048 du serveur
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

		// Extraction du modulus (n) et de l'exposant (e)
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
	 * Déchiffrement RSA avec le padding PKCS#1 v1.5 attendu par PRONOTE
	 */
	static decryptRSA(base64Data: string, privateKeyPem: string): string {
		try {
			const buffer = Buffer.from(base64Data, "base64");
			const decrypted = crypto.privateDecrypt(
				{
					key: privateKeyPem,
					padding: crypto.constants.RSA_PKCS1_PADDING,
				},
				buffer
			);
			return decrypted.toString("utf-8");
		} catch {
			return Buffer.from(base64Data, "base64").toString("utf-8");
		}
	}

	/**
	 * Chiffrement AES-CBC (128 ou 256 selon la taille de clé fournie)
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
	 * Déchiffrement AES-CBC
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
	 * Dérive la clé de hachage selon la formule PRONOTE : MD5(username + SHA256(alea + password))
	 */
	static getCle(alea: string, username: string, password: string): Buffer {
		const sha256 = crypto.createHash("sha256").update(alea + password, "utf-8").digest("hex").toUpperCase();
		return crypto.createHash("md5").update(username + sha256, "utf-8").digest();
	}

	/**
	 * Résout le challenge côté serveur pour anticiper la réponse du client
	 */
	static decryptChallenge(challengeHex: string, alea: string, username: string, password: string, iv: Buffer): string {
		const key = PronoteCrypto.getCle(alea, username, password);
		const algorithm = key.length === 32 ? "aes-256-cbc" : "aes-128-cbc";

		// 1. Déchiffrement du challenge envoyé
		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		const decrypted = Buffer.concat([
			decipher.update(Buffer.from(challengeHex, "hex")),
			decipher.final(),
		]).toString("binary");

		// 2. PRONOTE supprime un caractère sur deux
		let filtered = "";
		for (let i = 0; i < decrypted.length; i += 2) {
			filtered += decrypted[i];
		}

		// 3. Rechiffrement du texte filtré
		const cipher = crypto.createCipheriv(algorithm, key, iv);
		const solved = Buffer.concat([
			cipher.update(Buffer.from(filtered, "utf-8")),
			cipher.final(),
		]);

		return solved.toString("hex");
	}

	/**
	 * Génère l'aléa et le challenge de connexion
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
	 * Génère la clé AES de session définitive négociée après authentification
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
}