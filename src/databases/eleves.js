const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database (students initialization).');
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
    notes TEXT,
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
    discordId TEXT
  )`;
    db.run(table, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table "students" initialized.');
        }
    });

    const exampleUser = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password, notes, adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville, discordId)
  SELECT 'KATY', 'Alex', 3, '3A', 'groupe1,groupe2', 'akaty', 'Password123!', '[{"id": 0, "subject": "Maths", "grade": "17", "outof": "20", "date": "27/06/2023", "commentary": "Trigo n°2", "coef": "1"}, {"id": 1, "subject": "Anglais", "grade": "20", "outof": "20", "date": "21/06/2023", "commentary": "Verbes irréguliers", "coef": "1"}]',
  '', '', '', '', '', 'akaty@fossnote.com', '33', '123456789AB', 'France', 'Rhône-Alpes', '0712345678', 'Lyon', '0'
  WHERE NOT EXISTS (SELECT 1 FROM students WHERE username = 'akaty')`;
    db.run(exampleUser, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Example student initialized.');
        }
    });
});

// Fonction pour créer un nouvel utilisateur avec des notes au format JSON
async function createUser(nom, prenom, usertype, classe, groupes, ids, notes, adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville) {
    const insert = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password, notes, adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville, discordId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nom, prenom, usertype, classe, groupes.join(','), ids.username, ids.password, JSON.stringify(notes), adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville, "0"];
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
                    notes,
                    adresse1,
                    adresse2,
                    adresse3,
                    adresse4,
                    codePostal,
                    eMail,
                    indicatifTel,
                    numeroINE,
                    pays,
                    province,
                    telephonePortable,
                    ville
                };
                resolve(user);
            }
        });
    });
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPassword(len) {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = len;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }
    return password;
}

function getRandom(input) {
    return input[Math.floor((Math.random() * input.length))];
}

function randomAdress() {
    var streetNames = ['pokemon center\'s street', 'pokemon\'s gym street', 'megalo\'s street', 'abyssal ruins street', 'celestica\'s district', 'pika\'s street',]; // Fake pokemon streets xD

    var cityNames = ['Bourg Palette', 'Jadielle', 'Argenta', 'Azuria', 'Carmin-sur-Mer', 'Lavanville', 'Céladopole', 'Safrania', 'Parmanie', 'Cramois\'Ile']; // Pokemon cities xD

    return {
        "zipCode": randomNumber(10000, 50000),
        "cityName": getRandom(cityNames),
        "stateName": "Kanto",
        "streetName": getRandom(streetNames),
        "streetNumber": randomNumber(1, 100),
        "country": "Discord"
    }
    
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
                    notes: row.notes,
                    ids: {
                        username: row.username,
                        password: row.password,
                        discordId: row.discordId
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
                    ville: row.ville
                } : null);
            }
        });
    });
}

async function createUserWithDiscord(nom, prenom, discordUsername, discordId) {

    const adress = randomAdress();

    const adresse1 = adress.streetNumber + " " + adress.streetName;
    const ville = adress.cityName;
    const codePostal = adress.zipCode;
    const pays = adress.country;
    const eMail = discordUsername + "@fossnote.uwu";
    const province = adress.stateName;
    const usertype = 3;
    const classe = "3A";
    const password = randomPassword(8);
    const notes = [{"id": 0, "subject": "Maths", "grade": randomNumber(0, 20).toString(), "outof": "20", "date": "27/06/2023", "commentary": "Trigo n°2", "coef": "1"}, {"id": 1, "subject": "Anglais", "grade": randomNumber(0, 20).toString(), "outof": "20", "date": "21/06/2023", "commentary": "Verbes irréguliers", "coef": "1"}];

    const insert = `INSERT INTO students (nom, prenom, usertype, classe, groupes, username, password, notes, adresse1, adresse2, adresse3, adresse4, codePostal, eMail, indicatifTel, numeroINE, pays, province, telephonePortable, ville, discordId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nom, prenom, usertype, classe, "", discordUsername, password, JSON.stringify(notes), adresse1, '', '', '', codePostal, eMail, '', '', pays, province, '', ville, discordId];
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
                    groupes: '',
                    ids: {
                        username: discordUsername,
                        password: password,
                        discordId: discordId
                    },
                    notes,
                    adresse1,
                    codePostal,
                    eMail,
                    indicatifTel: '',
                    numeroINE: '',
                    pays,
                    province,
                    telephonePortable: '',
                    ville
                };
                resolve(user);
            }
        });
    });
}

// Fonction pour récupérer un utilisateur existant par son id discord
async function getUserByDiscordId(discordId) {
    const select = `SELECT * FROM students WHERE discordId = ?`;
    const values = [discordId];
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
                    notes: row.notes,
                    ids: {
                        username: row.username,
                        password: row.password,
                        discordId: row.discordId
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
                    ville: row.ville
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

// Fonction pour ajouter des notes au format JSON à des utilisateurs existants dans une classe spécifique
async function addNotesToUsersInClass(classe, notes) {
    const select = `SELECT notes FROM students WHERE classe = ?`;
    const values = [classe];
    return new Promise((resolve, reject) => {
        db.get(select, values, (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                const existingNotes = JSON.parse(row.notes);
                const updatedNotes = existingNotes.concat(notes);
                const update = `UPDATE students SET notes = ? WHERE classe = ?`;
                const updateValues = [JSON.stringify(updatedNotes), classe];
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
    createUserWithDiscord,
    getUser,
    getUserByDiscordId,
    setPassword,
    addNotesToUser,
    getLastFiveNotesByUsername,
    getNotesByUsername,
    addNotesToUsersInClass,
    randomNumber
};