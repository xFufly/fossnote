const eleves = require('../../../../../databases/eleves');
const grades = require('../../../../../databases/grades');

const {
    encryptAES
} = require('../../../../../cipher');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;
    const challengeInfos = JSON.parse(currentSession.challenge);

    var user = await eleves.getUser(challengeInfos.username.toLowerCase());

    var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    var lastGrades = await grades.getGradesByStudent(user.id);

    var ordre = 1;

    const transformedServices = lastGrades.map(grade => ({
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

    const transformedGrades = lastGrades.map(grade => ({
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
              "L": "Trimestre 2", 
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