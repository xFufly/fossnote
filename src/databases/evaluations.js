const sqlite3 = require('sqlite3').verbose();
const eleves = require('./eleves');

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (evaluations initialization).');
    }
});

db.serialize(async () => {
    const table = `CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher TEXT,
    class TEXT,
    specialGroup TEXT,
    subject TEXT,
    date TEXT,
    publishingDate TEXT,
    commentary TEXT,
    outof TEXT,
    coef TEXT
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            createDemoEvaluation("pgothier", "3A", "", "Maths", "27/06/2023", "27/06/2023", "Trigo n°2", "20", "1")
            createDemoEvaluation("lgousse", "3A", "", "Anglais", "21/06/2023", "21/06/2023", "Verbes irréguliers", "20", "1")
            console.log('Table "evaluations" initialized.');
        }
    });
});

async function createEvaluation(teacher, currentClass, group, subject, date, publishingDate, commentary, outof, coef) {
    const insertQuery = `INSERT INTO evaluations (teacher, class, specialGroup, subject, date, publishingDate, commentary, outof, coef)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await new Promise((resolve, reject) => {
        db.run(insertQuery, [teacher, currentClass, group, subject, date, publishingDate, commentary, outof, coef], function(err) {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                const evaluationId = this.lastID; // Obtenir l'ID de l'évaluation insérée
                eleves.addNotesToUsersInClass(currentClass, {
                    "id": evaluationId,
                    "subject": subject,
                    "grade": "|5",
                    "outof": outof,
                    "date": publishingDate,
                    "commentary": commentary,
                    "coef": coef
                }).then(() => {
                    console.log('New evaluation created with ID:', evaluationId);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            }
        });
    });
}

async function createDemoEvaluation(teacher, currentClass, group, subject, date, publishingDate, commentary, outof, coef) {
    const selectQuery = `SELECT 1 FROM evaluations WHERE commentary = ?`;
    const insertQuery = `INSERT INTO evaluations (teacher, class, specialGroup, subject, date, publishingDate, commentary, outof, coef)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.get(selectQuery, [commentary], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row) {
            //console.log(`Homework already exists for classes: ${commentary}`);
        } else {
            db.run(insertQuery, [teacher, currentClass, group, subject, date, publishingDate, commentary, outof, coef], (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('New evaluation created.');
                }
            });
        }
    });
}

module.exports = {
    createEvaluation,
    createDemoEvaluation
};