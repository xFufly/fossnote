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
    password TEXT,
    notes TEXT
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table "students" init.');
        }
    });

    const exampleUser = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password, notes)
  SELECT 'KATY', 'Alex', 3, '3A', 'groupe1,groupe2', 'akaty', 'Password123!', '[{"id": 0, "subject": "Maths", "grade": "17", "outof": "20", "date": "27/06/2023"}, {"id": 1, "subject": "Anglais", "grade": "20", "outof": "20", "date": "21/06/2023"}]' 
  WHERE NOT EXISTS (SELECT 1 FROM students WHERE username = 'TDIDE')`;
    db.run(exampleUser, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Example user created.');
        }
    });
});

// Fonction pour créer un nouvel utilisateur avec des notes au format JSON
async function createUser(nom, prenom, usertype, classe, groupes, ids, notes) {
    const insert = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nom, prenom, usertype, classe, groupes.join(','), ids.username, ids.password, JSON.stringify(notes)];
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
                    ids,
                    notes
                };
                resolve(user);
            }
        });
    });
}

// Fonction pour récupérer un utilisateur existant par son nom d'utilisateur
async function getUser(username) {
    const select = `SELECT * FROM students WHERE username = ?`;
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
                    usertype: row.usertype,
                    classe: row.classe,
                    groupes: row.groupes.split(','),
                    notes : row.notes,
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

// Fonction pour ajouter des notes au format JSON à un utilisateur existant
async function addNotesToUser(id, notes) {
    const select = `SELECT notes FROM students WHERE username = ?`;
    const values = [id];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                const existingNotes = JSON.parse(row.notes);
                const updatedNotes = existingNotes.concat(notes);
                const update = `UPDATE students SET notes = ? WHERE username = ?`;
                const updateValues = [JSON.stringify(updatedNotes), id];
                db.run(update, updateValues, function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    });
}

// Fonction pour obtenir les 5 dernières notes d'un utilisateur en fonction de son nom d'utilisateur
async function getLastFiveNotesByUsername(username) {
    const select = `SELECT notes FROM students WHERE username = ?`;
    const values = [username];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                const notes = JSON.parse(row.notes);
                const lastFiveNotes = notes.slice(-5); // Obtient les 5 derniers éléments du tableau de notes
                resolve(lastFiveNotes);
            } else {
                resolve([]);
            }
        });
    });
}

// Fonction pour obtenir les 5 dernières notes d'un utilisateur en fonction de son nom d'utilisateur
async function getNotesByUsername(username) {
    const select = `SELECT notes FROM students WHERE username = ?`;
    const values = [username];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                const notes = JSON.parse(row.notes);
                resolve(notes);
            } else {
                resolve([]);
            }
        });
    });
}

module.exports = {
    createUser,
    getUser,
    setPassword,
    addNotesToUser,
    getLastFiveNotesByUsername,
    getNotesByUsername
};