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

module.exports = {
    generateRSAInfos,
    decryptRSA,
    decryptAES,
    encryptAES
};
