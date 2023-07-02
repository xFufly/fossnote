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
        classRepresentatives TEXT,
        teacherSubjects TEXT
    )`;

    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            createClass("3A", "pgothier", "pgothier,lgousse", "akaty", "pgothier(Maths,Technologie);lgousse(Anglais)");
            console.log('Table "classes" initialized.');
        }
    });
});

function createClass(name, headTeacher, teachers, classRepresentatives, teacherSubjects) {
    const selectQuery = `SELECT 1 FROM classes WHERE name = ?`;
    const insertQuery = `INSERT INTO classes (name, headTeacher, teachers, classRepresentatives, teacherSubjects)
                         VALUES (?, ?, ?, ?, ?)`;

    db.get(selectQuery, [name], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row) {
            //console.log(`Class already exists ${name}`);
        } else {
            db.run(insertQuery, [name, headTeacher, teachers, classRepresentatives, teacherSubjects], (err) => {
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
                        teacherSubjects: row.teacherSubjects
                    };
                });
                resolve(classes);
            }
        });
    });
}

function getTeachersSubjectsByClassName(className) {
    return new Promise((resolve, reject) => {
      const query = `SELECT teacherSubjects FROM classes WHERE name = ?`;
  
      db.get(query, [className], (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else if (row) {
          const teacherSubjects = row.teacherSubjects.split(';');
          const result = [];
          teacherSubjects.forEach(teacherSubject => {
            const [teacher, subjects] = teacherSubject.split('(');
            const subjectList = subjects.replace(')', '').split(',');
            subjectList.forEach(subject => {
              const existingSubject = result.find(item => item.subject === subject);
              if (existingSubject) {
                existingSubject.teachersTeachingThisSubjectInTheClass.add(teacher);
              } else {
                const newSubject = {
                  subject: subject,
                  teacherTeachingThisSubjectInTheClass: teacher
                };
                result.push(newSubject);
              }
            });
          });
          resolve(result);
        } else {
          resolve([]);
        }
      });
    });
  }
  
  
  


module.exports = {
    createClass,
    getClassesByTeacher,
    getTeachersSubjectsByClassName
};