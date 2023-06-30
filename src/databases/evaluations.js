const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (evaluations initialization).');
    }
});

db.serialize(() => {
    const table = `CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher TEXT,
    class TEXT,
    group TEXT,
    subject TEXT,
    date TEXT,
    publishingDate TEXT,
    commentary TEXT,
    outof TEXT,
    coef TEXT,
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            // createDemoEvaluations("pgothier", "3A", "", "Maths", "02/07/2023", "02/07/2023", "Trigo n°2", "20", "1") // TODO: func createDemoEvaluations
            console.log('Table "evaluations" initialized.');
        }
    });
});