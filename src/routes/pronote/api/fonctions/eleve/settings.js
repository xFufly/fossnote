const forge = require('node-forge');

const {
    get_metadata
} = require('../../../../../helpers');

const {
    decryptRSA,
    encryptAES
} = require('../../../../../cipher');

const session = require('../../../../../databases/session');
const eleves = require('../../../../../databases/eleves');

async function bind(req, res, currentSession) {

    const {
        espace_id,
        session_id,
    } = req.params;

    const metadata = get_metadata();
    const date = new Date();
    const dateServeurHttp = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv).then(async (enryptedNumeroOrdre) => {
        const challengeInfos = JSON.parse(currentSession.challenge);
        var user = await eleves.getUser(challengeInfos.username.toLowerCase());
        var fullName = user.nom + " " + user.prenom;
        const response = {
            nom: 'ParametresUtilisateur',
            session: parseInt(session_id),
            numeroOrdre: enryptedNumeroOrdre,
            donneesSec: {
                _Signature_: {
                    ModeExclusif: false
                },
                donnees: {
                    "ressource": {
                        "L": fullName,
                        "N": "0001", // TO UNDERSTAND
                        "G": 4, // User type + 1 ?
                        "P": 320, // User number ? 
                        "Etablissement": {
                            "_T": 24,
                            "V": {
                                "L": metadata.title,
                                "N": "0001" // TO UNDERSTAND
                            }
                        },
                        "avecPhoto": false,
                        "classeDEleve": {
                            "L": user.classe,
                            "N": "0001" // TO UNDERSTAND
                        },
                        "listeClassesHistoriques": {
                            "_T": 24,
                            "V": [{
                                "L": "3A",
                                "N": "0001", // TO UNDERSTAND
                                "AvecNote": true,
                                "AvecFiliere": false
                            }]
                        },
                        "listeGroupes": {
                            "_T": 24,
                            "V": [] // TO IMPLEMENT
                        },
                        "listeOngletsPourPiliers": {
                            "_T": 24,
                            "V": [{
                                    "G": 45,
                                    "listePaliers": {
                                        "_T": 24,
                                        "V": [{
                                            "L": "Cycle 4",
                                            "N": "0001", // TO UNDERSTAND
                                            "G": 27,
                                            "listePiliers": {
                                                "_T": 24,
                                                "V": [{
                                                        "L": "D1.1 - Langue française à l'oral et à l'écrit",
                                                        "N": "0001", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 1,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D1.3 - Langages mathématiques, scientifiques et informatiques",
                                                        "N": "114FB026DCD9B78", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 3,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D1.4 - Langage des arts et du corps",
                                                        "N": "114E7016DCD9B97", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 4,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D2 - Les méthodes et outils pour apprendre",
                                                        "N": "114A7006DCD9BBE", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 5,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D3 - La formation de la personne et du citoyen",
                                                        "N": "114A71F6DCD9BED", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 6,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D4 - Les systèmes naturels et les systèmes techniques",
                                                        "N": "1145F1E6DCD9BFA", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 7,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D5 - Les représentations du monde et l'activité humaine",
                                                        "N": "114031D6DCD9BE6", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 8,
                                                        "estPilierLVE": false,
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D1.2 - Langues étrangères et régionales - ANGLAIS LV1",
                                                        "N": "114D3036DCD9BEB", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 2,
                                                        "estPilierLVE": true,
                                                        "Service": {
                                                            "_T": 24,
                                                            "V": {
                                                                "L": "ANGLAIS LV1",
                                                                "N": "139AF67720C832F" // TO UNDERSTAND
                                                            }
                                                        },
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D1.2 - Langues étrangères et régionales - ESPAGNOL LV2",
                                                        "N": "114D3036DCD9BEB", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 2,
                                                        "estPilierLVE": true,
                                                        "Service": {
                                                            "_T": 24,
                                                            "V": {
                                                                "L": "ESPAGNOL LV2",
                                                                "N": "139D290720C8325" // TO UNDERSTAND
                                                            }
                                                        },
                                                        "estSocleCommun": true
                                                    },
                                                    {
                                                        "L": "D1.2 - Langues étrangères et régionales - LATIN",
                                                        "N": "114D3036DCD9BEB", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 2,
                                                        "estPilierLVE": true,
                                                        "Service": {
                                                            "_T": 24,
                                                            "V": {
                                                                "L": "LATIN",
                                                                "N": "1392C13730C83B5" // TO UNDERSTAND
                                                            }
                                                        },
                                                        "estSocleCommun": true
                                                    }
                                                ]
                                            }
                                        }]
                                    }
                                },
                                {
                                    "G": 249,
                                    "listePaliers": {
                                        "_T": 24,
                                        "V": [{
                                            "L": "Compétences numériques",
                                            "N": "1075CB1A8761902", // TO UNDERSTAND
                                            "G": 27,
                                            "listePiliers": {
                                                "_T": 24,
                                                "V": [{
                                                        "L": "Information et données",
                                                        "N": "11467106DCD9B27", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 21,
                                                        "estPilierLVE": false
                                                    },
                                                    {
                                                        "L": "Communication et collaboration",
                                                        "N": "1145C2F6DCD9BD9", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 22,
                                                        "estPilierLVE": false
                                                    },
                                                    {
                                                        "L": "Création de contenu",
                                                        "N": "114782E6DCD9B89", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 23,
                                                        "estPilierLVE": false
                                                    },
                                                    {
                                                        "L": "Protection et sécurité",
                                                        "N": "114A62D6DCD9BE9", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 24,
                                                        "estPilierLVE": false
                                                    },
                                                    {
                                                        "L": "Environnement numérique",
                                                        "N": "114CC2C6DCD9BD6", // TO UNDERSTAND
                                                        "G": 23,
                                                        "P": 25,
                                                        "estPilierLVE": false
                                                    }
                                                ]
                                            }
                                        }]
                                    }
                                }
                            ]
                        },
                        "listeOngletsPourPeriodes": {
                            "_T": 24,
                            "V": [{
                                    "G": 12,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1", 
                                                "N": "112BF20A4C8EF01", // TO UNDERSTAND
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F", // TO UNDERSTAND
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06", // TO UNDERSTAND
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77", // TO UNDERSTAND...
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 198,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 13,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 19,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "G": 1,
                                                "L": "Année (Trois trimestres)"
                                            },
                                            {
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 230,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 100,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 219,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 216,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 41,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 111,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1,
                                                "datePublication": {
                                                    "_T": 7,
                                                    "V": "20/11/2022"
                                                }
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1,
                                                "datePublication": {
                                                    "_T": 7,
                                                    "V": "26/02/2023"
                                                }
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1,
                                                "datePublication": {
                                                    "_T": 7,
                                                    "V": "27/08/2023"
                                                }
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 99,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 201,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 277,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                },
                                {
                                    "G": 278,
                                    "listePeriodes": {
                                        "_T": 24,
                                        "V": [{
                                                "L": "Trimestre 1",
                                                "N": "112BF20A4C8EF01",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 2",
                                                "N": "112BE23A4C8EF8F",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Trimestre 3",
                                                "N": "1121922A4C8EF06",
                                                "G": 2,
                                                "A": true,
                                                "GenreNotation": 1
                                            },
                                            {
                                                "L": "Hors période",
                                                "N": "112E926A4C8EF77",
                                                "G": 4,
                                                "A": true,
                                                "GenreNotation": 0
                                            }
                                        ]
                                    },
                                    "periodeParDefaut": {
                                        "_T": 24,
                                        "V": {
                                            "L": "Trimestre 2",
                                            "N": "112BE23A4C8EF8F"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "listeInformationsEtablissements": {
                        "_T": 24,
                        "V": [{
                            "L": metadata.title,
                            "N": "0001", 
                            "urlLogo": {
                                "_T": 23,
                                "V": "fichierurlpublique/logo.png?param=7DA3DEB97ED4E736E373FCE0BB40DB4281FBD05307DB4D7E7E1DC065C831C64E61C8F8C5F59E354A3B08823FB973BF9716C51F9244BA438572C9E7C2F1C69A8C1B5DF2ACBEFDF0140821A888B63796A0"
                            },
                            "Coordonnees": {
                                "Adresse1": "",
                                "Adresse2": "",
                                "CodePostal": "",
                                "LibellePostal": "",
                                "LibelleVille": "",
                                "Province": "",
                                "Pays": "",
                                "SiteInternet": ""
                            },
                            "avecInformations": false
                        }]
                    },
                    "parametresUtilisateur": {
                        "version": 1,
                        "EDT": {
                            "afficherCoursAnnules": true,
                            "axeInverseEDT": false,
                            "axeInversePlanningHebdo": true,
                            "axeInversePlanningJour": false,
                            "axeInversePlanningJour2": false,
                            "nbJours": 0,
                            "nbRessources": 0,
                            "nbJoursEDT": 0,
                            "nbSequences": 0
                        },
                        "theme": {
                            "theme": 8
                        },
                        "Communication": {
                            "DiscussionNonLues": false
                        }
                    },
                    "autorisationsSession": {
                        "fonctionnalites": {
                            "gestionTwitter": true,
                            "attestationEtendue": false,
                            "gestionARBulletins": true
                        }
                    },
                    "autorisations": {
                        "AvecDiscussion": true,
                        "AvecDiscussionPersonnels": true,
                        "AvecDiscussionProfesseurs": true,
                        "incidents": {},
                        "intendance": {},
                        "services": {},
                        "cours": {
                            "domaineConsultationEDT": {
                                "_T": 8,
                                "V": "[1..62]"
                            },
                            "domaineModificationCours": {
                                "_T": 8,
                                "V": "[]"
                            },
                            "masquerPartiesDeClasse": true
                        },
                        "tailleMaxDocJointEtablissement": 2048000,
                        "tailleMaxRenduTafEleve": 4194304,
                        "consulterDonneesAdministrativesAutresEleves": true,
                        "compte": {
                            "avecInformationsPersonnelles": true
                        },
                        "autoriserImpression": true
                    },
                    "reglesSaisieMDP": {
                        "min": 8,
                        "max": 32,
                        "regles": {
                            "_T": 26,
                            "V": "[4]"
                        }
                    },
                    "listeCloud": {
                        "_T": 24,
                        "V": [{
                                "G": 1,
                                "L": "Dropbox",
                                "avecPartageDossier": true,
                                "avecChoixFormat": false,
                                "avecAccesSSO": false
                            }
                        ]
                    },
                    "listeCloudDepotServeur": {
                        "_T": 24,
                        "V": [{
                                "G": 1,
                                "L": "Dropbox"
                            }
                        ]
                    },
                    "autorisationKiosque": true,
                    "autorisationCloud": true,
                    "tabEtablissementsModeleGrille": [],
                    "listeOnglets": [{
                            "G": 7
                        },
                        {
                            "G": 6,
                            "Onglet": [{
                                    "G": 49
                                },
                                {
                                    "G": 148
                                }
                            ]
                        },
                        {
                            "G": 61,
                            "Onglet": [{
                                    "G": 89
                                },
                                {
                                    "G": 88
                                },
                                {
                                    "G": 275
                                }
                            ]
                        },
                        {
                            "G": 3,
                            "Onglet": [{
                                    "G": 198
                                },
                                {
                                    "G": 12
                                },
                                {
                                    "G": 217,
                                    "Onglet": [{
                                            "G": 13
                                        },
                                        {
                                            "G": 41
                                        }
                                    ]
                                },
                                {
                                    "G": 38,
                                    "Onglet": [{
                                            "G": 111
                                        },
                                        {
                                            "G": 112
                                        }
                                    ]
                                },
                                {
                                    "G": 227
                                }
                            ]
                        },
                        {
                            "G": 55,
                            "Onglet": [{
                                    "G": 204,
                                    "Onglet": [{
                                            "G": 201
                                        },
                                        {
                                            "G": 277
                                        }
                                    ]
                                },
                                {
                                    "G": 218,
                                    "Onglet": [{
                                            "G": 100
                                        },
                                        {
                                            "G": 219
                                        }
                                    ]
                                },
                                {
                                    "G": 237,
                                    "Onglet": [{
                                            "G": 45
                                        },
                                        {
                                            "G": 216
                                        }
                                    ]
                                },
                                {
                                    "G": 178
                                },
                                {
                                    "G": 249
                                },
                                {
                                    "G": 228
                                }
                            ]
                        },
                        {
                            "G": 39,
                            "Onglet": [{
                                    "G": 83
                                },
                                {
                                    "G": 44
                                },
                                {
                                    "G": 34
                                }
                            ]
                        },
                        {
                            "G": 5,
                            "Onglet": [{
                                    "G": 16
                                },
                                {
                                    "G": 19
                                },
                                {
                                    "G": 37
                                }
                            ]
                        },
                        {
                            "G": 52,
                            "Onglet": [{
                                    "G": 42
                                },
                                {
                                    "G": 101
                                },
                                {
                                    "G": 195
                                }
                            ]
                        },
                        {
                            "G": 2,
                            "Onglet": [{
                                    "G": 8
                                },
                                {
                                    "G": 131
                                },
                                {
                                    "G": 9
                                },
                                {
                                    "G": 10
                                },
                                {
                                    "G": 11
                                }
                            ]
                        }
                    ],
                    "listeOngletsInvisibles": [
                        44,
                        83,
                        227,
                        228
                    ],
                    "listeOngletsNotification": [
                        131,
                        8
                    ]
                },
                nom: 'ParametresUtilisateur'
            }
        };
        res.json(response);
        return true;
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    bind
};