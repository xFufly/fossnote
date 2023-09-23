const eleves = require('../../../../../databases/eleves');

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

    const user = await eleves.getUser(challengeInfos.username.toLowerCase());

    const numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    const periodes = get_metadata().Periodes;

    const currentPeriod = getCurrentPeriod(periodes);

    const notes = await eleves.getNotesByUsername(challengeInfos.username.toLowerCase());

    let ordre = 12;

    let services = {};

    const transformedServices = notes.map(grade => {
        if (!services.hasOwnProperty(grade.subject)) {
            services[grade.subject] = ordre;
            ordre++;
        }
    
        return {
            "G": 12,
            "L": grade.subject,
            "N": "1300" + services[grade.subject],
            "couleur": "#F49737", // TODO: Enable configuration
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
            "ordre": services[grade.subject]
        };
    });

    gradeOrder = 0;

    const transformedGrades = notes.map(grade => ({
        "N": "3400" + gradeOrder.toString(),
        "G": 60,
        "coefficient": parseInt(grade.coef ? grade.coef : "1"),
        "commentaire": grade.commentary ? grade.commentary : "",
        "note": {
            "_T": 10,
            "V": grade.grade
        },
        "bareme": {
            "_T": 10,
            "V": grade.outof
        },
        "baremeParDefaut": {
            "_T": 10,
            "V": "20"
        },
        "date": {
            "_T": 7,
            "V": grade.date
        },
        "ListeThemes": {
            "_T": 24,
            "V": [] // TODO: TO UNDERSTAND / TO UPDATE
        },
        "periode": { // TODO: Enable configuration
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
                "N": "1300" + services[grade.subject],
                "couleur": "#F49737" // TODO: Enable configuration
            }
        }
        // TODO: executionQCM
    }));

    const response = {
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
    };

    res.json(response);
    return true;
}

module.exports = {
    bind
};
