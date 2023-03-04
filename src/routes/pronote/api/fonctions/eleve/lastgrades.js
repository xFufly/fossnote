const eleves = require('../../../../../databases/eleves');
const grades = require('../../../../../databases/grades');

const {
    encryptAES
} = require('../../../../../cipher');

const {
    get_metadata,
    getCurrentPeriod
} = require('../../../../../helpers');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;
    const challengeInfos = JSON.parse(currentSession.challenge);

    var user = await eleves.getUser(challengeInfos.username.toLowerCase());

    var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    var periodes = get_metadata().Periodes;

    var currentPeriod = getCurrentPeriod(periodes);

    var currentGrades = await grades.getGradesBetweenDates(currentPeriod.from, currentPeriod.to, user.id);

    var ordre = 1;

    const transformedServices = currentGrades.map(grade => ({
        "G": 12,
        "L": grade.subject,
        "N": "0001",
        "couleur": "#F49737", // TODO : Enable configuration
        "baremeMoyEleve": {
            "_T": 10,
            "V": "20"
        },
        "baremeMoyEleveParDefaut": {
            "_T": 10,
            "V": "20"
        },
        "estServiceEnGroupe": true,
        "moyClasse": { // TODO
            "_T": 10,
            "V": "??"
        },
        "moyEleve": { // TODO
            "_T": 10,
            "V": "??"
        },
        "moyMax": { // TODO
            "_T": 10,
            "V": "??"
        },
        "moyMin": { // TODO
            "_T": 10,
            "V": "??"
        },
        "ordre": ordre++
    }));

    const transformedGrades = currentGrades.map(grade => ({
        "N": "0001",
        "G": 60,
        "note": {
          "_T": 10,
          "V": grade.grade
        },
        "bareme": {
          "_T": 10,
          "V": grade.scale
        },
        "baremeParDefaut": {
          "_T": 10,
          "V": 20
        },
        "date": {
          "_T": 7,
          "V": grade.date
        },
        "ListeThemes": {
            "_T": 24,
            "V": [] // TODO / TO UNDERSTAND
        },
        "periode": { // TODO : Enable configuration
            "_T": 24,
            "V": {
              "L": currentPeriod.name, 
              "N": "0001"
            }
        },
        "service": {
            "_T": 24,
            "V": {
                "G": 12,
                "L": grade.subject,
                "N": "0001",
                "couleur": "#F49737" // TODO : Enable configuration
            }
        }
        // TODO : executionQCM
    }));

    var response = {
        "nom": "DernieresNotes",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "DernieresNotes",
            "donnees": {
                "avecDetailDevoir": true,
                "avecDetailService": true,
                "listeDevoirs": {
                    "_T": 24,
                    "V": transformedGrades
                },
                "listeServices": {
                    "_T": 24,
                    "V": transformedServices
                }
            }
        }
    }

    res.json(response);
    return true;
}

module.exports = {
    bind
};