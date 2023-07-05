const teachers = require('../../../../../databases/teachers');
const classes = require('../../../../../databases/classes');
const subjects = require('../../../../../databases/subjects');

const {
    get_metadata,
    getCurrentPeriod
} = require('../../../../../helpers');

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

    const periodes = get_metadata().Periodes;

    const donnees = req.body.donneesSec.donnees;

    const period = donnees.periode;
    const classId = donnees.ressource.N;
    const subjectId = donnees.service.N;
    
    const currentClass = await classes.getClassById(parseInt(classId.slice(4)));
    const currentSubject = await subjects.getSubjectById(parseInt(subjectId.slice(4)));

    console.log({period, currentClass, currentSubject})

    const response = {
        "nom": "PageNotes",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "PageNotes",
            "donnees": {
                "autorisations": {
                    "_T": 24,
                    "V": {
                        "modifierCoefficientGeneral": true,
                        "modifierParametresServices": true
                    }
                },
                "baremeParDefaut": {
                    "_T": 10,
                    "V": "20"
                },
                "baremeService": {
                    "_T": 10,
                    "V": "20"
                },
                "listeClasses": {
                    "_T": 24
                },
                "listeCorriges": {
                    "_T": 24,
                    "V": [] // TODO | Sync with DB
                },
                "listeDevoirs": {
                    "_T": 24
                },
                "listeEleves": {
                    "_T": 24
                },
                "listeSujets": {
                    "_T": 24,
                    "V": [] // TODO | Sync with DB
                },
                "service": {
                    "_T": 24
                },
                "serviceEntier": {
                    "_T": 24
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