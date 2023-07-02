const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (teachers initialization).');
    }
});

db.serialize(() => {
    const table = `CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    genre TEXT,
    usertype INTEGER,
    username TEXT UNIQUE,
    password TEXT,
    adresse1 TEXT,
    adresse2 TEXT,
    adresse3 TEXT,
    adresse4 TEXT,
    codePostal TEXT,
    eMail TEXT,
    indicatifTel TEXT,
    numeroINE TEXT,
    pays TEXT,
    province TEXT,
    telephonePortable TEXT,
    ville TEXT,
    postIt TEXT
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table "teachers" initialized.');
        }
    });

    const exampleTeacherPgothier = `INSERT INTO teachers (nom, prenom, genre, usertype, username, password, adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville, postIt)
  SELECT 'GOTHIER', 'Paula', 'F', 1, 'pgothier', 'Password123!', '', '', '', '', '', 'pgothier@fossnote.com', '33', '987654321CD', 'France', 'Rhône-Alpes', '0676767676', 'Villeurbanne', ''
  WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE username = 'pgothier')`;
    db.run(exampleTeacherPgothier, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Example teacher "pgothier" initialized.');
        }
    });

    const exampleTeacherLgousse = `INSERT INTO teachers (nom, prenom, genre, usertype, username, password, adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville, postIt)
    SELECT 'GOUSSE', 'Léo', 'M', 1, 'lgousse', 'Password123!', '', '', '', '', '', 'lgousse@fossnote.com', '33', '345678910EF', 'France', 'Rhône-Alpes', '0766666000', 'Sainte-Foy-lès-Lyon', ''
    WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE username = 'lgousse')`;
      db.run(exampleTeacherLgousse, (err) => {
          if (err) {
              console.error(err.message);
          } else {
              console.log('Example teacher "lgousse" initialized.');
          }
      });
});

// Fonction pour récupérer un enseignant existant par son nom d'utilisateur
async function getTeacher(username) {
    const select = `SELECT * FROM teachers WHERE username = ?`;
    const values = [username];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? {
                    id: row.id,
                    nom: row.nom,
                    prenom: row.prenom,
                    genre: row.genre,
                    usertype: row.usertype,
                    ids: {
                        username: row.username,
                        password: row.password
                    },
                    adresse1: row.adresse1,
                    adresse2: row.adresse2,
                    adresse3: row.adresse3,
                    adresse4: row.adresse4,
                    codePostal: row.codePostal,
                    eMail: row.eMail,
                    indicatifTel: row.indicatifTel,
                    numeroINE: row.numeroINE,
                    pays: row.pays,
                    province: row.province,
                    telephonePortable: row.telephonePortable,
                    ville: row.ville,
                    postIt: row.postIt
                } : null);
            }
        });
    });
}

// Fonction pour éditer le post-it d'un enseignant existant
async function editTeacherPostIt(username, newPostIt) {
    const update = `UPDATE teachers SET postIt = ? WHERE username = ?`;
    const values = [newPostIt, username];
    return new Promise((resolve, reject) => {
        db.run(update, values, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    getTeacher,
    editTeacherPostIt
};