const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

db.serialize(() => {
    const table = `CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject TEXT,
        value INTEGER,
        scale INTEGER,
        date TEXT,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table "grades" init.');
        }
    });

    const exampleGrade = `INSERT INTO grades (student_id, subject, value, scale, date)
        SELECT 1, 'Maths', 15, 20, '23/01/2023'
        WHERE NOT EXISTS (SELECT 1 FROM grades WHERE student_id = 1 AND subject = 'Maths' AND value = 15 AND scale = 20 AND date = '23/01/2023')`;
    db.run(exampleGrade, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

// Fonction pour ajouter une note à un élève
async function addGrade(student_id, subject, value, scale, date) {
    const insert = `INSERT INTO grades (student_id, subject, value, scale, date) VALUES (?, ?, ?, ?, ?)`;
    const values = [student_id, subject, value, scale, date];
    return new Promise((resolve, reject) => {
        db.run(insert, values, function(err) {
            if (err) {
                reject(err);
            } else {
                const grade = {
                    id: this.lastID,
                    student_id,
                    subject,
                    value,
                    scale,
                    date
                };
                resolve(grade);
            }
        });
    });
}

// Fonction pour récupérer toutes les notes d'un élève
async function getGradesByStudent(student_id) {
    const select = `SELECT * FROM grades WHERE student_id = ?`;
    const values = [student_id];
    return new Promise((resolve, reject) => {
        db.all(select, values, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const grades = rows.map(row => ({
                    id: row.id,
                    student_id: row.student_id,
                    subject: row.subject,
                    grade: row.value,
                    scale: row.scale,
                    date: row.date
                }));
                resolve(grades);
            }
        });
    });
}

// Fonction pour récupérer les 9 dernières notes d'un élève
async function getLastNineGrades(student_id) {
    const select = `SELECT * FROM grades WHERE student_id = ? ORDER BY date DESC LIMIT 9`;
    const values = [student_id];
    return new Promise((resolve, reject) => {
        db.all(select, values, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const grades = rows.map(row => ({
                    id: row.id,
                    studentId: row.student_id,
                    subject: row.subject,
                    grade: row.value,
                    scale: row.scale,
                    date: row.date
                }));
                resolve(grades);
            }
        });
    });
}

// Fonction pour récupérer les notes entre deux dates
async function getGradesBetweenDates(startDate, endDate, student_id) {
    const select = `SELECT * FROM grades WHERE (date BETWEEN ? AND ?) AND (student_id = ?) ORDER BY date DESC`;
    const values = [startDate, endDate, student_id];
    return new Promise((resolve, reject) => {
        db.all(select, values, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const grades = rows.map(row => ({
                    id: row.id,
                    studentId: row.student_id,
                    subject: row.subject,
                    grade: row.value,
                    scale: row.scale,
                    date: row.date
                }));
                resolve(grades);
            }
        });
    });
}


module.exports = {
    addGrade,
    getGradesByStudent,
    getLastNineGrades,
    getGradesBetweenDates
};
