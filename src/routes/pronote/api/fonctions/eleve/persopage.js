const eleves = require('../../../../../databases/eleves');

const {
    encryptAES
} = require('../../../../../cipher');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;

    const challengeInfos = JSON.parse(currentSession.challenge);

    const user = await eleves.getUser(challengeInfos.username.toLowerCase());

    const numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    const response = {
        "nom": "PageInfosPerso",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "PageInfosPerso",
            "donnees": {
                "Informations": {
                    "adresse1": user.adresse1,
                    "adresse2": user.adresse2,
                    "adresse3": user.adresse3,
                    "adresse4": user.adresse4,
                    "codePostal": user.codePostal,
                    "ville": user.ville,
                    "province": user.province,
                    "pays": user.pays,
                    "eMail": user.eMail,
                    "telephonePortable": user.telephonePortable,
                    "indicatifTel": user.indicatifTel,
                    "numeroINE": user.numeroINE
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