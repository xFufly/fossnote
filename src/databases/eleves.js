const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

db.serialize(() => {
  const table = `CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    usertype INTEGER,
    classe TEXT,
    groupes TEXT,
    username TEXT UNIQUE,
    password TEXT
  )`;
  db.run(table, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Table "students" init.');
    }
  });
  
  const exampleUser = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password)
  SELECT 'KATY', 'Alex', 3, '3A', 'groupe1,groupe2', 'akaty', 'Password123!'
  WHERE NOT EXISTS (SELECT 1 FROM students WHERE username = 'TDIDE')`;
  db.run(exampleUser, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Example user created.');
    }
  });
});

// Fonction pour créer un nouvel utilisateur
async function createUser(nom, prenom, usertype, classe, groupes, ids) {
  const insert = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [nom, prenom, usertype, classe, groupes.join(','), ids.username, ids.password];
  return new Promise((resolve, reject) => {
    db.run(insert, values, function(err) {
      if (err) {
        reject(err);
      } else {
        const user = {
          id: this.lastID,
          nom,
          prenom,
          usertype,
          classe,
          groupes,
          ids
        };
        resolve(user);
      }
    });
  });
}

// Fonction pour récupérer un utilisateur existant par son identifiant
async function getUser(id) {
  const select = `SELECT * FROM students WHERE username = ?`;
  const values = [id];
  return new Promise((resolve, reject) => {
    db.get(select, values, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? {
          id: row.id,
          nom: row.nom,
          prenom: row.prenom,
          usertype: row.usertype,
          classe: row.classe,
          groupes: row.groupes.split(','),
          ids: {
            username: row.username,
            password: row.password
          }
        } : null);
      }
    });
  });
}

// Fonction pour mettre à jour le mot de passe d'un utilisateur
async function setPassword(id, password) {
  const update = `UPDATE students SET password = ? WHERE username = ?`;
  const values = [password, id];
  return new Promise((resolve, reject) => {
    db.run(update, values, function(err) {
      if (err) {
        reject(err);
      } else if (this.changes === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

module.exports = { createUser, getUser, setPassword };
