const teachers = require('../../../../../databases/teachers');
const classes = require('../../../../../databases/classes');

const {
    encryptAES
} = require('../../../../../cipher');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;

    const challengeInfos = JSON.parse(currentSession.challenge);

    const user = await teachers.getTeacher(challengeInfos.username.toLowerCase());

    const numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    const teacherClasses = await classes.getClassesByTeacher(challengeInfos.username.toLowerCase());

    const transformedClasses = teacherClasses.map(teacherClass => { 
        return {
            "G": 1,
            "L": teacherClass.name,
            "N": "2300" + teacherClass.id
        };
    });

    const response = {
        "nom": "listeClassesGroupes",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "listeClassesGroupes",
            "donnees": {
                "listeClassesGroupes": {
                    "_T": 24,
                    "V": transformedClasses
                }
            }
        }
    };

    res.json(response);
    return true;
}

module.exports = {
    bind
};