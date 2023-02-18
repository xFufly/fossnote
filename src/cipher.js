var forge = require('node-forge');


function generateRSAInfos() {
    // Générer une paire de clé
    const keypair = forge.pki.rsa.generateKeyPair(2048);

    // Les convertir au format PEM
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

    // Extraire le modulus et l'exponent de la clé publique
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const modulus = publicKey.n.toString(16);
    const exponent = publicKey.e.toString(16);

    rsaData = {
        "publicKeyModulus": modulus,
        "publicKeyExponent": exponent,
        "privateKeyPem": privateKeyPem
    }
    return rsaData;
}

function decryptRSA(data, privateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decryptedData = privateKey.decrypt(forge.util.decode64(data), 'RSAES-PKCS1-V1_5');
    return decryptedData;
}

async function encryptAES(data, key, iv) {
    var aeskey = forge.util.hexToBytes(key);
    var createIv = (iv !== null);
    var aesiv = createIv ? forge.util.hexToBytes(iv) : new forge.util.ByteBuffer('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
    data = new forge.util.ByteBuffer(data);
    const lChiffreur = forge.cipher.createCipher('AES-CBC', aeskey);
    lChiffreur.start({
        iv: aesiv
    });
    lChiffreur.update(data);
    return lChiffreur.finish() && lChiffreur.output.toHex();
}

async function decryptAES(data, key, iv) {
    var aeskey = forge.util.hexToBytes(key);
    var createIv = (iv !== null);
    var aesiv = createIv ? forge.util.hexToBytes(iv) : new forge.util.ByteBuffer('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
    data = new forge.util.ByteBuffer(forge.util.hexToBytes(data));
    const lChiffreur = forge.cipher.createDecipher('AES-CBC', aeskey);
    lChiffreur.start({
        iv: aesiv
    });
    lChiffreur.update(data);
    return lChiffreur.finish() && lChiffreur.output.bytes();
}

async function generateChallenge(username, password, iv) {
    const randomString = forge.util.bytesToHex(forge.random.getBytesSync(16));
    const key = forge.md.md5.create().update(getBuffer(getCle(randomString, username, password)).bytes()).digest();
    var aesiv = forge.util.hexToBytes(iv);
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: aesiv });
    const challenge = forge.util.encodeUtf8(username + randomString);
    cipher.update(forge.util.createBuffer(challenge));
    cipher.finish();
    const challengeEncrypted = forge.util.bytesToHex(cipher.output.getBytes());
    const solvedChallenge = decryptChallenge(challengeEncrypted, randomString, username, password, aesiv);
    console.log(forge.util.bytesToHex(key));
    console.log(key);
    return {alea: randomString, challenge: challengeEncrypted, solved: solvedChallenge, key: forge.util.bytesToHex(key), username: username};
}

function decryptChallenge(challenge, alea, username, password, iv) {
    // Convertit la chaîne de défi de hexadécimal en octets
    const challengeBytes = forge.util.hexToBytes(challenge);

    // Calcule la clé comme un hachage MD5 de la concaténation de username et mtp
    const randomString = alea; // Remplacer par la valeur réelle de la chaîne aléatoire
    const sha256 = forge.md.sha256.create();
    sha256.update(randomString + password);
    const mtp = sha256.digest().toHex().toUpperCase();
    const key = forge.md.md5.create().update(username + mtp).digest().getBytes();

    // Déchiffre le défi en utilisant AES-CBC-256
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(challengeBytes));
    decipher.finish();
    const decrypted = decipher.output.getBytes();

    // Supprime chaque deuxième caractère du texte déchiffré
    let modified = '';
    for (let i = 0; i < decrypted.length; i += 2) {
        modified += decrypted.charAt(i);
    }

    // Chiffre le texte modifié en utilisant AES-CBC-256
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(modified, 'utf8'));
    cipher.finish();
    const encrypted = cipher.output.toHex();

    return encrypted;
}

function getCle(alea, username, password) {
    return username + forge.md.sha256.create().update(alea).update(forge.util.encodeUtf8(password)).digest().toHex().toUpperCase();
}

function getBuffer(aChaine) {
    return new forge.util.ByteBuffer(forge.util.encodeUtf8(aChaine));
} 

function generateFinalKey(key, iv) {
    // Générez 16 bytes aléatoires
    var bytes = forge.random.getBytesSync(16);

    // Convertissez les bytes en une chaîne de nombres séparés par des virgules
    var byteValues = Array.prototype.slice.call(bytes).join(',');

    console.log(key);

    // Chiffrez la chaîne de nombres avec une clé de chiffrement AES aléatoire
    var cipher = forge.cipher.createCipher('AES-ECB', forge.util.hexToBytes(key));
    cipher.start({iv: forge.util.hexToBytes(iv)});
    cipher.update(forge.util.createBuffer(byteValues));
    cipher.finish();
    var encrypted = cipher.output.getBytes();

    return {solved: bytes.toHex(), key: encrypted.toHex()};
}

module.exports = {
    generateRSAInfos,
    decryptRSA,
    decryptAES,
    encryptAES,
    generateChallenge,
    getCle,
    getBuffer,
    generateFinalKey
};
