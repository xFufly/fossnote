const eleves = require('../../../../databases/eleves');
const session = require('../../../../databases/session');

const forge = require('node-forge');

const { getDateNow } = require('../../../../helpers');


const {
    encryptAES,
    generateFinalKey
} = require('../../../../cipher');

async function bind(req, res, currentSession) {
    const {
        espace_id,
        session_id
    } = req.params;
    const challengeInfos = JSON.parse(currentSession.challenge);
    const solvedChallenge = challengeInfos.solved;
    const challengeKey = challengeInfos.key;
    
    const requestedChallenge = req.body.donneesSec.donnees.challenge;

    if(solvedChallenge === requestedChallenge) {

        var fullName = "";

        const espaceId = parseInt(espace_id);
        if(espaceId === 3) {
            var user = await eleves.getUser(challengeInfos.username.toLowerCase());
            fullName = user.nom + " " + user.prenom;
        }

        var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

        var newKey = await generateFinalKey(challengeKey, JSON.parse(currentSession.aes).iv);

        await session.setAesSession(session_id, {
            key: newKey.solved,
            iv: JSON.parse(currentSession.aes).iv
        });

        var response = {
            nom: "Authentification",
            session: parseInt(session_id),
            numeroOrdre: numeroOrdre,
            donneesSec: {
                nom: "Authentification",
                donnees: {
                    libelleUtil: fullName,
                    cle: newKey.key,
                    modeSecurisationParDefaut: 3,
                    derniereConnexion: {
                        V: getDateNow(),
                        _T: 7
                    }
                }
            }
        }
        res.json(response);

        return true;
    } else {
        var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

        var response = {
            nom: "Authentification",
            session: parseInt(session_id),
            numeroOrdre: numeroOrdre,
            donneesSec: {
                nom: "Authentification",
                donnees: {
                    Acces: 1
                }
            }
        }
        res.json(response);
        return false;
    }
}


module.exports = {
    bind
};