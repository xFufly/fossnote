const forge = require('node-forge');

const {
    generateChallenge,
    encryptAES
} = require('../../../../cipher');

const eleves = require('../../../../databases/eleves');
const session = require('../../../../databases/session');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;

    var username = req.body.donneesSec.donnees.identifiant;
    var espace = req.body.donneesSec.donnees.genreEspace;
    if(espace === 3) {
        var user = await eleves.getUser(username.toLowerCase());
        if(user !== null) {
            var challenge = await generateChallenge(username.toLowerCase(), user.ids.password, JSON.parse(currentSession.aes).iv);
            await session.setChallengeSession(session_id, challenge);

            var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);
            var response = {
                nom: "Identification",
                session: parseInt(session_id),
                numeroOrdre: numeroOrdre,
                donneesSec: {
                    nom: "Identification",
                    donnees: {
                        alea: challenge.alea,
                        modeCompMdp: 0,
                        modeCompLog: 1,
                        challenge: challenge.challenge
                    }
                }
            }
            res.json(response);
            return true;
        } else {

        }
    }
}

module.exports = {
    bind
};