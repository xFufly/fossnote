const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('session.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the "session" database.');
  }
});
const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

// Fonction pour créer la table "sessions"
function createSessionsTable() {
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    _id TEXT PRIMARY KEY,
    numeroOrdre INTEGER,
    session_params TEXT,
    privateKeyPem TEXT,
    expiresAt INTEGER,
    aes TEXT,
    challenge TEXT
  )`);
}

async function createSession(session_id, numeroOrdre, session_params, privateKeyPem, aes, challenge) {
  db.run(`DELETE FROM sessions WHERE expiresAt <= ?`, Date.now());
  const expiresAt = Date.now() + SESSION_DURATION;
  const stmt = db.prepare(`INSERT INTO sessions (_id, numeroOrdre, session_params, privateKeyPem, expiresAt, aes, challenge) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(session_id, numeroOrdre, JSON.stringify(session_params), privateKeyPem, expiresAt, JSON.stringify(aes), JSON.stringify(challenge));
  stmt.finalize();
  return session_id;
}

async function getSession(session_id) {
  const session = await new Promise((resolve, reject) => {
    db.get(`SELECT * FROM sessions WHERE _id = ? AND expiresAt > ?`, session_id, Date.now(), (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
        console.log("pwp: " + row);
      }
    });
  });
  await new Promise(resolve => setTimeout(resolve, 1000)); // pause de 1000 ms
  return await session;
}

async function setAesSession(session_id, aes) {
  const session = await getSession(session_id);
  if (session) {
    const stmt = db.prepare(`UPDATE sessions SET aes = ? WHERE _id = ?`);
    stmt.run(JSON.stringify(aes), session_id);
    stmt.finalize();
    return true;
  }
  return false;
}

async function setNumeroOrdreSession(numeroOrdre, session_id) {
  const session = await getSession(session_id);
  if (session && session.expiresAt > Date.now()) {
    const stmt = db.prepare(`UPDATE sessions SET numeroOrdre = ? WHERE _id = ?`);
    stmt.run(numeroOrdre, session_id);
    stmt.finalize();
    return true;
  }
  return false;
}

// Appel de la fonction pour créer la table "sessions"
createSessionsTable();

module.exports = {
  createSession,
  getSession,
  setAesSession,
  setNumeroOrdreSession
};
