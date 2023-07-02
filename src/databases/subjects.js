const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (subjects initialization).');
    }
});

db.serialize(() => {
    const table = `CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`;

    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            createSubject("Maths");
            createSubject("Technologie");
            createSubject("Anglais");
            console.log('Table "subjects" initialized.');
        }
    });
});

// Fonction pour récupérer une matière existante par son nom
async function getSubjectByName(name) {
    const select = `SELECT * FROM subjects WHERE name = ?`;
    const values = [name];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? {
                    id: row.id,
                    name: row.name
                } : null);
            }
        });
    });
}

// Fonction pour récupérer une matière existante par son id
async function getSubjectById(id) {
    const select = `SELECT * FROM subjects WHERE id = ?`;
    const values = [id];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? {
                    id: row.id,
                    name: row.name
                } : null);
            }
        });
    });
}

function createSubject(name) {
    const selectQuery = `SELECT 1 FROM subjects WHERE name = ?`;
    const insertQuery = `INSERT INTO subjects (name)
                         VALUES (?)`;

    db.get(selectQuery, [name], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row) {
            //console.log(`Subject already exists ${name}`);
        } else {
            db.run(insertQuery, [name], (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`New ${name} subject created.`);
                }
            });
        }
    });
}

module.exports = {
    createSubject,
    getSubjectByName,
    getSubjectById
};