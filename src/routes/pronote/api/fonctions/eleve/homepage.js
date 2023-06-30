const eleves = require('../../../../../databases/eleves');
// const grades = require('../../../../../databases/grades');

const {
    getHomeworksByClassNC // NC for No Callback
} = require('../../../../../databases/homeworks');

const forge = require('node-forge');

const {
    get_metadata,
    getCurrentPeriod,
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

    const lastFiveNotes = await eleves.getLastFiveNotesByUsername(challengeInfos.username.toLowerCase());

    var periodes = get_metadata().Periodes;

    var currentPeriod = getCurrentPeriod(periodes);

    const transformedGrades = lastFiveNotes.map(grade => ({
        "N": "0001",
        "G": 60,
        "note": {
            "_T": 10,
            "V": grade.grade
        },
        "bareme": {
            "_T": 10,
            "V": grade.outof
        },
        "baremeParDefaut": {
            "_T": 10,
            "V": 20
        },
        "date": {
            "_T": 7,
            "V": grade.date
        },
        "ListeThemes": {
            "_T": 24,
            "V": [] // TODO: TO UNDERSTAND / TO UPDATE
        },
        "periode": { // TODO: Enable configuration
            "_T": 24,
            "V": {
                "L": currentPeriod.name,
                "N": "0001"
            }
        },
        "service": {
            "_T": 24,
            "V": {
                "G": 12,
                "L": grade.subject,
                "N": "0001",
                "couleur": "#F49737" // TODO: Enable configuration
            }
        }
        // TODO: executionQCM
    }));

    const homeworks = await getHomeworksByClassNC(user.classe);

    let serviceOrder = 12;
    let services = {};
    let homeworksOrder = 1;
    let lessons = {};
    
    transformedHomeworks = homeworks.map(homework => {
        if (!services.hasOwnProperty(homework.subject)) {
            services[homework.subject] = serviceOrder;
            serviceOrder++;
        }
    
        return {
            "G": 0,
            "ordre": homeworksOrder++,
            "couleurFond": homework.hexColor,
            "couleurTexte": "#000000",
            "donneLe": {
                "_T": 7,
                "V": homework.date
            },
            "pourLe": {
                "_T": 7,
                "V": homework.endDate
            },
            "listeDocumentJoint": {
                "_T": 24,
                "V": []
            },
            "matiere": {
                "_T": 24,
                "V": {
                    "L": homework.subject,
                    "N": "8200" + services[homework.subject]
                }
            },
            "N": "1500" + homeworksOrder,
            "TAFFait": homework.locked == 1 ? true : false,
            "avecRendu": false,
            "peuRendre": false,
            "descriptif": {
                "_T": 21,
                "V": ("<div>" + homework.description + "</div>").replace("\n", "<br/>")
            },
            "duree": 0,
            "niveauDifficulte": 0
        };
    });

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
                        "V": transformedGrades
                    },
                    "page": {
                        "periode": {
                            "_T": 24,
                            "V": {
                                "L": currentPeriod.name,
                                "N": "0001"
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
                "menuDeLaCantine": { // TODO : SYNC WITH DB
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
                        "V": transformedHomeworks
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