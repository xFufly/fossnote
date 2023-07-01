const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (classes initialization).');
    }
});

db.serialize(() => {
    const table = `CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    headTeacher TEXT,
    teachers TEXT,
    classRepresentatives TEXT
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            createClass("3A", "pgothier", "pgothier,lgousse", "akaty,")
            console.log('Table "classes" initialized.');
        }
    });
});

function createClass(name, headTeacher, teachers, classRepresentatives) {
    const selectQuery = `SELECT 1 FROM classes WHERE name = ?`;
    const insertQuery = `INSERT INTO classes (name, headTeacher, teachers, classRepresentatives)
                         VALUES (?, ?, ?, ?)`;

    db.get(selectQuery, [name], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row) {
            //console.log(`Class already exists ${name}`);
        } else {
            db.run(insertQuery, [name, headTeacher, teachers, classRepresentatives], (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`New ${name} class created.`);
                }
            });
        }
    });
}

function getClassesByTeacher(teacher) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM classes WHERE teachers LIKE '%${teacher}%'`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                const classes = rows.map(row => {
                    return {
                        id: row.id,
                        name: row.name,
                        headTeacher: row.headTeacher,
                        teachers: row.teachers,
                        classRepresentatives: row.classRepresentatives,
                    };
                });
                resolve(classes);
            }
        });
    });
}

module.exports = {
    createClass,
    getClassesByTeacher
};