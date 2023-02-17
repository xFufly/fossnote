const express = require('express');
const router = express.Router();

const forge = require('node-forge');

const {
    decryptAES
} = require('../../../cipher');

const session = require('../../../databases/session');

const funcParams = require('./fonctions/parametres');
const funcParamsHome = require('./fonctions/parametreshome');

// Création d'une nouvelle route pour la deuxième étape du protocole
router.post('/:espace_id/:session_id/:numero_ordre', async (req, res) => {
    const {
        espace_id,
        session_id,
        numero_ordre
    } = req.params;
    const nom = req.body.nom;

    try {
        const currentSession = await session.getSession(session_id);
        var key = currentSession.aes.key;
        var iv = currentSession.aes.iv;
        var numeroOrdreDecrypted = decryptAES(numero_ordre, key, iv);
        if ((currentSession.numeroOrdre + 1) === parseInt(numeroOrdreDecrypted)) {
            session.setNumeroOrdreSession(currentSession.numeroOrdre + 2);
        } else {

        }

        if (nom === "FonctionParametres") {
            if(req.body.donneesSec.hasOwnProperty('donnees')) {
                await funcParams.bind(req, res, currentSession);
            } else {
                await funcParamsHome.bind(req, res, currentSession);
            }
        }
    } catch (error) {
        console.error(error);
    }
});


module.exports = router;