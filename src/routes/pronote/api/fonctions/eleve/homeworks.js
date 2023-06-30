const eleves = require('../../../../../databases/eleves');

const {
    encryptAES
} = require('../../../../../cipher');

const {
    getHomeworksByClass
} = require('../../../../../databases/homeworks');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;

    const challengeInfos = JSON.parse(currentSession.challenge);

    const user = await eleves.getUser(challengeInfos.username.toLowerCase());

    const numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    

    getHomeworksByClass(user.classe, (err, homeworks) => {
        if (err) {
            console.error(err);
        } else {

            let serviceOrder = 12;
            let services = {};
            let homeworksOrder = 1;
            let lessons = {};

            const transformedHomeworks = homeworks.map(homework => {
                if (!services.hasOwnProperty(homework.subject)) {
                    services[homework.subject] = serviceOrder;
                    serviceOrder++;
                }
            
                return {
                    "CouleurFond": homework.hexColor,
                    "DonneLe": {
                        "_T": 7,
                        "V": homework.date
                    },
                    "PourLe": {
                        "_T": 7,
                        "V": homework.endDate
                    },
                    "ListePieceJointe": {
                        "_T": 24,
                        "V": []
                    },
                    "ListeThemes": {
                        "_T": 24,
                        "V": []
                    },
                    "Matiere": {
                        "_T": 24,
                        "V": {
                            "L": homework.subject,
                            "N": "8200" + services[homework.subject]
                        }
                    },
                    "N": "1500" + homeworksOrder++,
                    "TAFFait": homework.locked == 1 ? true : false,
                    "avecMiseEnForme": false,
                    "cahierDeTextes": {
                        "_T": 24,
                        "N": "1800" + homeworksOrder
                    },
                    "descriptif": {
                        "_T": 21,
                        "V": ("<div>" + homework.description + "</div>").replace("\n", "<br/>")
                    },
                    "duree": 0,
                    "libelleCBTheme": "Uniquement les thèmes associés aux matières du travail à faire",
                    "niveauDifficulte": 0,
                    "nomPublic": user.classe
                };
            });
            const response = {
                "nom": "PageCahierDeTexte",
                "session": parseInt(session_id),
                "numeroOrdre": numeroOrdre,
                "donneesSec": {
                    "nom": "PageCahierDeTexte",
                    "donnees": {
                        "ListeTravauxAFaire": {
                            "_T": 24,
                            "V": transformedHomeworks
                        }
                    }
                }
            };
        
            res.json(response);
            return true;
        }
    });
}

module.exports = {
    bind
};