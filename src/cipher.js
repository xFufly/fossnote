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
    const mtp = forge.md.sha256.create().update(forge.util.hexToBytes(randomString + password)).digest().toHex().toUpperCase();
    const key = forge.md.md5.create().update(getBuffer(getCle(randomString)).bytes()).digest();
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: iv });
    const challenge = forge.util.encodeUtf8(username + randomString);
    cipher.update(forge.util.createBuffer(challenge));
    cipher.finish();
    const challengeEncrypted = forge.util.bytesToHex(cipher.output.getBytes());
    /*const hexArr = forge.util.hexToBytes(challengeEncrypted);
    const filteredHexArr = filterHexArray(hexArr);
    const challengeDecrypted = forge.util.decodeUtf8(forge.util.bytesToHex(filteredHexArr));
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(challengeDecrypted));
    cipher.finish();*/
    return {alea: randomString, challenge: challengeEncrypted};
}

function filterHexArray(hexArray) {
    const filteredArr = [];
    for (let i = 0; i < hexArray.length; i++) {
        if (i % 2 === 0) {
            filteredArr.push(hexArray[i]);
        }
    }
    return filteredArr;
}

function getCle(alea, username, password) {
    return username + forge.md.sha256.create().update(alea).update(forge.util.encodeUtf8(password)).digest().toHex().toUpperCase();
}

function getBuffer(aChaine) {
    return new forge.util.ByteBuffer(forge.util.encodeUtf8(aChaine));
}

function removeEverySecondCharacter(str) {
    let newStr = '';
    for (let i = 0; i < str.length; i += 2) {
        newStr += str[i];
    }
    return newStr;
  }
  

module.exports = {
    generateRSAInfos,
    decryptRSA,
    decryptAES,
    encryptAES,
    generateChallenge,
    getCle,
    getBuffer,
    filterHexArray
};
