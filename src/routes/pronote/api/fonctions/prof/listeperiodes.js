const teachers = require('../../../../../databases/teachers');

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
    const currentPeriod = getCurrentPeriod(periodes);

    const response = {
        "nom": "ListePeriodes",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "ListePeriodes",
            "donnees": {
                "listePeriodes": {
                    "_T": 24,
                    "V": [
                        {
                            "A": true,
                            "G": 2,
                            "GenreNotation": periodes.p1.periodeScolaire ? 1 : 0,
                            "L": periodes.p1.name,
                            "N": "11200" + periodes.p1.id
                        },
                        {
                            "A": true,
                            "G": 2,
                            "GenreNotation": periodes.p2.periodeScolaire ? 1 : 0,
                            "L": periodes.p2.name,
                            "N": "11200" + periodes.p2.id
                        },
                        {
                            "A": true,
                            "G": 2,
                            "GenreNotation": periodes.p3.periodeScolaire ? 1 : 0,
                            "L": periodes.p3.name,
                            "N": "11200" + periodes.p3.id
                        }
                    ]
                },
                "periodeParDefaut" : {
                    "_T" : 24,
                    "V": {
                        "L": currentPeriod.name,
                        "N": "11200" + currentPeriod.id
                    }
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