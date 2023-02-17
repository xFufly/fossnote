const Datastore = require('nedb-promises');

const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

const db = Datastore.create({ filename: 'session.db', autoload: true });

// Index sur le champ "expire_at" pour la suppression des sessions expirées
db.ensureIndex({ fieldName: 'expiresAt', expireAfterSeconds: 0 });

// Fonction pour créer une nouvelle session
async function createSession(session_id, numeroOrdre, session_params, privateKeyPem, aes) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  await db.insert({ _id: session_id, numeroOrdre, session_params, privateKeyPem, expiresAt, aes });
  return session_id;
}

// Fonction pour récupérer une session existante
async function getSession(session_id) {
  const session = await db.findOne({ _id: session_id, expiresAt: { $gt: new Date() } });
  return session ? session : null;
}

// Fonction pour mettre à jour le paramètre "aes" d'une session
async function setAesSession(session_id, aes) {
    const session = await getSession(session_id);
    if (session) {
      session.aes = aes;
      await db.update({ _id: session_id }, session);
      return true;
    }
    return false;
}
  
// Fonction pour mettre à jour le paramètre "numeroOrdre" d'une session
async function setNumeroOrdreSession(session_id, numeroOrdre) {
    const session = await getSession(session_id);
    if (session) {
      session.numeroOrdre = numeroOrdre;
      await db.update({ _id: session_id }, session);
      return true;
    }
    return false;
}
  

module.exports = { createSession, getSession, setAesSession, setNumeroOrdreSession };