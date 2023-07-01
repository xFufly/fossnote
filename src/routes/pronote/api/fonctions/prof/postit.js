const teachers = require('../../../../../databases/teachers');

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

    const newPostIt = req.body.donneesSec.donnees.penseBete;

    teachers.editTeacherPostIt(challengeInfos.username.toLowerCase(), newPostIt);

    const response = {
        "nom": "SaisiePenseBete",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "SaisiePenseBete",
            "donnees": {}
        }
    };

    res.json(response);
    return true;
}

module.exports = {
    bind
};