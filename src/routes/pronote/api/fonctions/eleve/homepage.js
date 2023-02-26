const session = require('../../../../../databases/session');
const eleves = require('../../../../../databases/eleves');

const forge = require('node-forge');

const {
    getDateToday,
    getDateTomorrow
} = require('../../../../../helpers');

const {
    encryptAES
} = require('../../../../../cipher');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;
    const challengeInfos = JSON.parse(currentSession.challenge);

    var fullName = "";

    var user = await eleves.getUser(challengeInfos.username.toLowerCase());
    fullName = user.nom + " " + user.prenom;


    var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    var response = { // To Sync With DB
        nom: "PageAccueil",
        session: parseInt(session_id),
        numeroOrdre: numeroOrdre,
        donneesSec: {
            nom: "PageAccueil",
            donnees: {
                "notes": {
                    "avecDetailDevoir": true,
                    "avecDetailService": true,
                    "listeDevoirs": {
                        "_T": 24,
                        "V": []
                    },
                    "page": {
                        "periode": {
                            "_T": 24,
                            "V": {
                                "L": "Trimestre 2",
                                "N": "11200510AA257D1"
                            }
                        }
                    }
                },
                "competences": {
                    "listeEvaluations": {
                        "_T": 24,
                        "V": []
                    }
                },
                "vieScolaire": {
                    "L": "Observations, Absences, Retards, Sanctions, Exclusions de cours, Autres punitions, Mesures conservatoires",
                    "autorisations": {
                        "saisieMotifAbsence": false,
                        "absence": true,
                        "retard": true,
                        "saisieMotifRetard": false,
                        "punition": true,
                        "exclusion": true,
                        "sanction": true,
                        "mesureConservatoire": true,
                        "absenceInternat": false,
                        "observation": true,
                        "incident": true,
                        "totalHeuresManquees": true
                    },
                    "listeAbsences": {
                        "_T": 24,
                        "V": []
                    }
                },
                "menuDeLaCantine": {
                    "listeRepas": {
                        "_T": 24,
                        "V": [{
                                "N": "758B55B9DF4D15",
                                "G": 0,
                                "listePlats": {
                                    "_T": 24,
                                    "V": [{
                                            "G": 0,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                        "L": "Feuilleté au fromage ",
                                                        "N": "723F7B541E1063",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    },
                                                    {
                                                        "L": "Salade de printemps",
                                                        "N": "728F09561E100A",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "G": 1,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                    "L": "Steak fromager",
                                                    "N": "723B75501E1064",
                                                    "listeLabelsAlimentaires": {
                                                        "_T": 24,
                                                        "V": []
                                                    }
                                                }]
                                            }
                                        },
                                        {
                                            "G": 2,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                        "L": "Penné régate",
                                                        "N": "7266BF551E1013",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    },
                                                    {
                                                        "L": "Poêlée nantaise",
                                                        "N": "72CDD9501E10F0",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "G": 4,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                        "L": "Fromage blanc",
                                                        "N": "725092541E10EF",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    },
                                                    {
                                                        "L": "Fruits de saison",
                                                        "N": "7255BC561E10E3",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "N": "754054B9DF4D6B",
                                "G": 1,
                                "listePlats": {
                                    "_T": 24,
                                    "V": [{
                                            "G": 0,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                    "L": "Buffet de hors d'oeuvre",
                                                    "N": "726E62541E107B",
                                                    "listeLabelsAlimentaires": {
                                                        "_T": 24,
                                                        "V": []
                                                    }
                                                }]
                                            }
                                        },
                                        {
                                            "G": 1,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                    "L": "Paupiette de dinde",
                                                    "N": "724239571E10AF",
                                                    "listeLabelsAlimentaires": {
                                                        "_T": 24,
                                                        "V": []
                                                    }
                                                }]
                                            }
                                        },
                                        {
                                            "G": 2,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                    "L": "Ratatouille niçoise",
                                                    "N": "7204D6561E1052",
                                                    "listeLabelsAlimentaires": {
                                                        "_T": 24,
                                                        "V": []
                                                    }
                                                }]
                                            }
                                        },
                                        {
                                            "G": 4,
                                            "listeAliments": {
                                                "_T": 24,
                                                "V": [{
                                                        "L": "Fruits",
                                                        "N": "729963541E100E",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    },
                                                    {
                                                        "L": "Produits laitiers ",
                                                        "N": "727383571E1062",
                                                        "listeLabelsAlimentaires": {
                                                            "_T": 24,
                                                            "V": []
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                "actualites": {
                    "listeModesAff": [{
                        "G": 0,
                        "listeActualites": {
                            "_T": 24,
                            "V": []
                        }
                    }]
                },
                "elections": {
                    "listeElections": {
                        "_T": 24,
                        "V": []
                    }
                },
                "agenda": {
                    "listeEvenements": []
                },
                "prochaineDate": {
                    "_T": 7,
                    "V": getDateTomorrow()
                },
                "dateSelectionnee": {
                    "_T": 7,
                    "V": getDateToday()
                },
                "avecCoursAnnule": true,
                "placeCourante": 100,
                "prefsGrille": {
                    "genreRessource": 4
                },
                "ListeCours": [],
                "debutDemiPensionHebdo": 126,
                "finDemiPensionHebdo": 132,
                "absences": {
                    "listeAbsences": {
                        "_T": 24,
                        "V": []
                    },
                    "listeRetards": {
                        "_T": 24,
                        "V": []
                    },
                    "listePunitions": {
                        "_T": 24,
                        "V": []
                    },
                    "listeInfirmeries": {
                        "_T": 24,
                        "V": []
                    },
                    "avecDemiPension": true,
                    "joursCycle": {
                        "_T": 24,
                        "V": [{
                            "jourCycle": 4,
                            "DP": {}
                        }]
                    }
                },
                "recreations": {
                    "_T": 24,
                    "V": [{
                            "L": "Récréation du matin",
                            "place": 4
                        },
                        {
                            "L": "Récréation de l'après-midi",
                            "place": 14
                        }
                    ]
                },
                "travailAFaire": {
                    "listeTAF": {
                        "_T": 24,
                        "V": [
                            {
                                "N": "155C58019E7EEB3",
                                "G": 0,
                                "matiere": {
                                    "_T": 24,
                                    "V": {
                                        "L": "MATHEMATIQUES",
                                        "N": "82B6644D123177"
                                    }
                                },
                                "descriptif": {
                                    "_T": 21,
                                    "V": "<div>To sync with a db</div>"
                                },
                                "ordre": 44984,
                                "pourLe": {
                                    "_T": 7,
                                    "V": "27/02/2023"
                                },
                                "donneLe": {
                                    "_T": 7,
                                    "V": "24/02/2023"
                                },
                                "couleurFond": "#F49737",
                                "couleurTexte": "#000000",
                                "niveauDifficulte": 0,
                                "duree": 0,
                                "listeDocumentJoint": {
                                    "_T": 24,
                                    "V": []
                                },
                                "TAFFait": false
                            }
                        ]
                    }
                },
                "discussions": {
                    "listeEtiquettes": {
                        "_T": 24,
                        "V": [{
                                "L": "Brouillons",
                                "N": "54370AF3877694",
                                "G": 4
                            },
                            {
                                "L": "Corbeille",
                                "N": "54080BF38776D7",
                                "G": 5
                            }
                        ]
                    },
                    "listeMessagerie": {
                        "_T": 24,
                        "V": []
                    }
                },
                "ressourcePedagogique": {
                    "listeRessources": {
                        "_T": 24,
                        "V": []
                    },
                    "listeMatieres": {
                        "_T": 24,
                        "V": []
                    }
                },
                "QCM": {
                    "listeExecutionsQCM": [],
                    "listeDevoirs": []
                },
                "devoirSurveille": {
                    "listeDS": {
                        "_T": 24,
                        "V": []
                    }
                },
                "enseignementADistance": {
                    "jours": {
                        "_T": 24,
                        "V": []
                    },
                    "actif": false
                },
                "kiosque": {
                    "listeRessources": {
                        "_T": 24,
                        "V": []
                    }
                },
                "lienUtile": {
                    "listeLiens": {
                        "_T": 24,
                        "V": []
                    }
                },
                "partenaireCDI": {}
            }
        }
    }
    res.json(response);

    return true;

}


module.exports = {
    bind
};