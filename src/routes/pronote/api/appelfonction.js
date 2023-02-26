const express = require('express');
const router = express.Router();

const forge = require('node-forge');

const {
    decryptAES,
    encryptAES
} = require('../../../cipher');

const session = require('../../../databases/session');

const funcParams = require('./fonctions/parametres');
const funcParamsHome = require('./fonctions/parametreshome');
const funcIdentification = require('./fonctions/identification');
const funcAuth = require('./fonctions/authentification');

const funcStudentSettings = require('./fonctions/eleve/settings');
const funcStudentHomepage = require('./fonctions/eleve/homepage');

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
        var key = JSON.parse(currentSession.aes).key;
        var iv = JSON.parse(currentSession.aes).iv;
        var numeroOrdreDecrypted = await decryptAES(numero_ordre, key, iv);
        if ((currentSession.numeroOrdre + 1) === parseInt(numeroOrdreDecrypted)) {
            var numeroOrdreUpdated = await session.setNumeroOrdreSession(currentSession.numeroOrdre + 2, session_id);
            if (numeroOrdreUpdated) {
                
            } else {
                
            }
        } else {
            
        }

        if (nom === "FonctionParametres") {
            if (req.body.donneesSec.hasOwnProperty('donnees')) {
                await funcParams.bind(req, res, currentSession);
            } else {
                await funcParamsHome.bind(req, res, currentSession);
            }
        } else if (nom === "Identification") {
            await funcIdentification.bind(req, res, currentSession);
        } else if (nom === "Authentification") {
            await funcAuth.bind(req, res, currentSession);
        } else if (nom === "ParametresUtilisateur") {
            if(espace_id === "3") {
                await funcStudentSettings.bind(req, res, currentSession);
            }
        } else if (nom === "Navigation") {
            var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);
            var response = {
                nom: "Navigation",
                session: parseInt(session_id),
                numeroOrdre: numeroOrdre,
                donneesSec: {
                    nom: "Navigation",
                    donnees: {}
                }
            }
            res.json(response);
        } else if (nom === "PageAccueil") {
            if(espace_id === "3") {
                await funcStudentHomepage.bind(req, res, currentSession);
            }
        }
    } catch (error) {
        console.error(error);
    }
});


module.exports = router;