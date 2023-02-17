const forge = require('node-forge');

const {
    generateChallenge,
    encryptAES
} = require('../../../../cipher');

const eleves = require('../../../../databases/eleves');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;

    var username = req.body.donneesSec.donnees.identifiant;
    var espace = req.body.donneesSec.donnees.genreEspace;
    if(espace === 3) {
        
        var user = await eleves.getUser(username);
        if(user !== null) {
            var challenge = await generateChallenge(username, user.ids.password, currentSession.aes.iv);

            var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), currentSession.aes.key, currentSession.aes.iv);
            console.log(currentSession.numeroOrdre + 2);
            var response = {
                nom: "Identification",
                session: parseInt(session_id),
                numeroOrdre: numeroOrdre,
                donneesSec: {
                    nom: "Identification",
                    donnees: {
                        alea: challenge.alea,
                        modeCompMdp: 0,
                        modeCompLog: 0,
                        challenge: challenge.challenge
                    }
                }
            }
            res.json(response);
            return true;
        }
    }
}

module.exports = {
    bind
};