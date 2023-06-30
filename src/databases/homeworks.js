const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (homeworks initialization).');
    }
});

db.serialize(() => {
    const table = `CREATE TABLE IF NOT EXISTS homeworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT,
    title TEXT,
    description TEXT,
    teachers TEXT,
    classes TEXT,
    groupes TEXT,
    students TEXT,
    date TEXT,
    endDate TEXT,
    hexColor TEXT,
    locked INTEGER
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            createDemoHomework("Maths", "Devoir maison", "Exercices 2 et 3 page 255", "Mme Gothier P.", "3A", "", "", "30/06/2023", "30/06/2023", "#F49737", 0)
            console.log('Table "homeworks" initialized.');
        }
    });
});

function createHomework(subject, title, description, teachers, classes, groupes, students, date, endDate, hexColor, locked) {
    const insertQuery = `INSERT INTO homeworks (subject, title, description, teachers, classes, groupes, students, date, endDate, hexColor, locked)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(insertQuery, [subject, title, description, teachers, classes, groupes, students, date, endDate, hexColor, locked], (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('New homework created.');
        }
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

function createDemoHomework(subject, title, description, teachers, classes, groupes, students, date, endDate, hexColor, locked) {
    const selectQuery = `SELECT 1 FROM homeworks WHERE classes = ?`;
    const insertQuery = `INSERT INTO homeworks (subject, title, description, teachers, classes, groupes, students, date, endDate, hexColor, locked)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.get(selectQuery, [classes], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row) {
            //console.log(`Homework already exists for classes: ${classes}`);
        } else {
            db.run(insertQuery, [subject, title, description, teachers, classes, groupes, students, date, endDate, hexColor, locked], (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('New homework created.');
                }
            });
        }
    });
}

function getHomeworksByClass(className, callback) {
    const query = `SELECT * FROM homeworks WHERE classes LIKE ?`;
    const classFilter = `%${className}%`;

    db.all(query, [classFilter], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            const homeworks = rows.map(row => {
                return {
                    id: row.id,
                    subject: row.subject,
                    title: row.title,
                    description: row.description,
                    teachers: row.teachers,
                    classes: row.classes,
                    groupes: row.groupes,
                    students: row.students,
                    date: row.date,
                    endDate: row.endDate,
                    hexColor: row.hexColor,
                    locked: row.locked
                };
            });
            callback(null, homeworks);
        }
    });
}

async function getHomeworksByClassNC(className) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM homeworks WHERE classes LIKE ?`;
        const classFilter = `%${className}%`;

        db.all(query, [classFilter], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                const homeworks = rows.map(row => {
                    return {
                        id: row.id,
                        subject: row.subject,
                        title: row.title,
                        description: row.description,
                        teachers: row.teachers,
                        classes: row.classes,
                        groupes: row.groupes,
                        students: row.students,
                        date: row.date,
                        endDate: row.endDate,
                        hexColor: row.hexColor,
                        locked: row.locked
                    };
                });
                resolve(homeworks);
            }
        });
    });
}

function getHomeworksByGroup(groupName, callback) {
    const query = `SELECT * FROM homeworks WHERE groupes LIKE ?`;
    const groupFilter = `%${groupName}%`;

    db.all(query, [groupFilter], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            const homeworks = rows.map(row => {
                return {
                    id: row.id,
                    subject: row.subject,
                    title: row.title,
                    description: row.description,
                    teachers: row.teachers,
                    classes: row.classes,
                    groupes: row.groupes,
                    students: row.students,
                    date: row.date,
                    endDate: row.endDate,
                    hexColor: row.hexColor,
                    locked: row.locked
                };
            });
            callback(null, homeworks);
        }
    });
}

function getHomeworksByStudent(studentName, callback) {
    const query = `SELECT * FROM homeworks WHERE students LIKE ?`;
    const studentFilter = `%${studentName}%`;

    db.all(query, [studentFilter], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            const homeworks = rows.map(row => {
                return {
                    id: row.id,
                    subject: row.subject,
                    title: row.title,
                    description: row.description,
                    teachers: row.teachers,
                    classes: row.classes,
                    groupes: row.groupes,
                    students: row.students,
                    date: row.date,
                    endDate: row.endDate,
                    hexColor: row.hexColor,
                    locked: row.locked
                };
            });
            callback(null, homeworks);
        }
    });
}

module.exports = {
    createHomework,
    createDemoHomework,
    getHomeworksByClass,
    getHomeworksByGroup,
    getHomeworksByStudent,
    getHomeworksByClassNC
};