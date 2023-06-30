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
    teachers TEXT
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            // createDemoClass("3A", "pgothier", "pgothier,lgousse") // TODO: func createDemoClass
            console.log('Table "classes" initialized.');
        }
    });
});