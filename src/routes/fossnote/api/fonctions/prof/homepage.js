const eleves = require('../../../../../databases/eleves');
// const grades = require('../../../../../databases/grades');
const teachers = require('../../../../../databases/teachers');

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

    var user = await teachers.getTeacher(challengeInfos.username.toLowerCase());
    fullName = user.nom + " " + user.prenom;


    var numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    var periodes = get_metadata().Periodes;

    var currentPeriod = getCurrentPeriod(periodes);
    

    var response = { // To Sync With DB
        "nom": "PageAccueil",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "PageAccueil",
            "donnees": {
                "conseilDeClasse": {
                  "avecNotes": true,
                  "avecCompetences": true,
                  "avecAppr": true,
                  "listeClasses": {
                    "_T": 24,
                    "V": [] // TODO : SYNC WITH DB
                  },
                  "periodeParDefaut": {
                    "_T": 24,
                    "V": {
                      "L": "Trimestre 3",
                      "N": "112A403FE09EADA"
                    }
                  }
                },
                "ressources": {
                  "listeMatieres": {
                    "_T": 24,
                    "V": [
                      {
                        "L": "Maths",
                        "N": "82001",
                        "nbrRessources": [] // TODO : TO UNDERSTAND
                      }
                    ]
                  }
                },
                "kiosque": {
                  "listeRessources": {
                    "_T": 24,
                    "V": []
                  }
                },
                "penseBete": {
                  "libelle": user.postIt
                },
                "lienUtile": {
                  "listeLiens": {
                    "_T": 24,
                    "V": [ // TODO : SYNC WITH DB
                      {
                        "L": "Protocole sanitaire",
                        "commentaire": "",
                        "url": "https://www.education.gouv.fr/annee-scolaire-2022-2023-protocole-sanitaire-342184"
                      },
                      {
                        "L": "Les éco-délégués, c'est quoi ?",
                        "commentaire": "",
                        "url": "https://eduscol.education.fr/1121/les-eco-delegues"
                      }
                    ]
                  }
                },
                "partenaireCDI": {},
                "elections": {
                  "listeElections": {
                    "_T": 24,
                    "V": [] // TODO : SYNC WITH DB
                  }
                },
                "personnelsAbsents": {
                  "listePersonnelsAbsents": {
                    "_T": 24,
                    "V": [] // TODO : SYNC WITH DB
                  },
                  "listePersonnels": {
                    "_T": 24,
                    "V": [] // TODO : SYNC WITH DB
                  }
                },
                "avecCoursAnnule": true,
                "ParametreExportiCal": "FC52F5734C704A62AA02BB8A5177D5709D309A77BF29EFDA6697F62DE28D4D070C21E6050E066B0574BBEE1DEECAF8C7", // TO UNDERSTAND
                "avecExportICal": true,
                "prefsGrille": {
                  "genreRessource": 3
                },
                "ListeCours": [], // TODO : SYNC WITH DB | IMPORTANT
                "debutDemiPensionHebdo": 108,
                "finDemiPensionHebdo": 111,
                "actualites": {}, // TODO : SYNC WITH DB
                "agenda": {
                  "listeEvenements": [] // TODO : SYNC WITH DB
                },
                "discussions": {
                  "listeEtiquettes": {
                    "_T": 24,
                    "V": [
                      {
                        "L": "Archives",
                        "N": "5474635CFC2D95",
                        "G": 2
                      },
                      {
                        "L": "Brouillons",
                        "N": "54B8655CFC2D91",
                        "G": 4
                      },
                      {
                        "L": "Corbeille",
                        "N": "543E645CFC2DEE",
                        "G": 5
                      },
                      {
                        "L": "Tchat",
                        "N": "5473595DFC2D71",
                        "G": 13
                      },
                      {
                        "L": "Alerte",
                        "N": "5469575DFC2D0C",
                        "G": 11
                      },
                      {
                        "L": "Contacter la vie scolaire",
                        "N": "54A5565DFC2D0E",
                        "G": 12
                      },
                      {
                        "L": "Bleu",
                        "N": "5496395CFC2D30",
                        "G": 7,
                        "abr": "B",
                        "couleur": "#3498DB"
                      },
                      {
                        "L": "Vert",
                        "N": "546B385CFC2D0A",
                        "G": 8,
                        "abr": "V",
                        "couleur": "#57C16E"
                      },
                      {
                        "L": "Rouge",
                        "N": "541F3B5CFC2DDF",
                        "G": 9,
                        "abr": "R",
                        "couleur": "#E55039"
                      }
                    ]
                  },
                  "listeMessagerie": {
                    "_T": 24,
                    "V": [] // TODO : SYNC WITH DB
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
                "appelNonFait": {
                  "listeAppelNonFait": {
                    "_T": 24,
                    "V": [] // TODO | TO SYNC WITH A DB
                  },
                  "listeProfCoursNonAssures": {
                    "_T": 24,
                    "V": [] // TODO | TO SYNC WITH A DB
                  }
                },
                "carnetDeCorrespondance": {
                  "listeObservations": {
                    "_T": 24,
                    "V": [] // TODO | TO SYNC WITH A DB
                  },
                  "listeClassesGroupes": {
                    "_T": 24,
                    "V": [
                      {
                        "L": "3A",
                        "N": "23001",
                        "G": 1
                      },
                      {
                        "L": "4B",
                        "N": "23002",
                        "G": 1
                      }
                    ]
                  }
                },
                "IntendanceExecute": {
                  "listeLignes": {
                    "_T": 24,
                    "V": []
                  }
                },
                "maintenanceInfoExecute": {
                  "listeLignes": {
                    "_T": 24,
                    "V": []
                  }
                },
                "TAFARendre": {
                  "listeTAF": {
                    "_T": 24,
                    "V": [
                      {} // TODO | TO SYNC WITH DB
                    ]
                  }
                }
              },
            "_Signature_": {
                "listeDonnees": {}
            }
        }
    }
    res.json(response);

    return true;

}


module.exports = {
    bind
};