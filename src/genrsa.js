const fs = require('fs');
const forge = require('node-forge');

// Générer une paire de clés RSA
const keyPair = forge.pki.rsa.generateKeyPair({ bits: 1024 });

// Convertir la clé publique en format PEM
const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

// Convertir la clé privée en format PEM
const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

// Créer un objet JSON avec les clés générées
const rsaConfig = {
    modulus: keyPair.publicKey.n.toString(16).toUpperCase(),
    exponent: keyPair.publicKey.e.toString(16).toUpperCase(),
    privateKeyPem: privateKeyPem,
    publicKeyPem: publicKeyPem,
};

// Chemin vers le fichier JSON de configuration
const configFilePath = './src/config/rsa.json';

// Écrire l'objet JSON dans le fichier
fs.writeFileSync(configFilePath, JSON.stringify(rsaConfig, null, 2));

console.log(`Clés RSA générées et enregistrées dans ${configFilePath}`);
