const forge = require('node-forge');

const { get_metadata, getCurrentSchoolYear, getFirstSchoolYear, getLastMondayOfAugust, getFirstWeekdayOfSeptember, getLastSchoolYear, getDateToday } = require('../../../../helpers');

const {
    decryptRSA,
    encryptAES
} = require('../../../../cipher');

const session = require('../../../../databases/session');

async function bind(req, res, currentSession) {

    const {
        espace_id,
        session_id,
    } = req.params;

    const metadata = get_metadata();
    const date = new Date();
    const dateServeurHttp = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    var uuid = req.body.donneesSec.donnees.Uuid;

    var privateKeyPem = currentSession.privateKeyPem;

    var newIv = decryptRSA(uuid, privateKeyPem);
    newIv = forge.md.md5.create().update(new forge.util.ByteBuffer(newIv).bytes()).digest().toHex();
    
    session.setAesSession(session_id, {
        key: JSON.parse(currentSession.aes).key,
        iv: newIv
    }).then((ok) => {
        var theme = 8;
        var avecChoixConnexion = false;
        var avecRecuperationInfosConnexion = false;

        if (ok) {
            var espaceNom = "Espace ";
            if (espace_id === "16") {
                espaceNom += "Direction";
            } else if (espace_id === "3") {
                espaceNom += "Élèves";
                avecRecuperationInfosConnexion = true;
            } else if (espace_id === "1") {
                espaceNom += "Professeurs";
                theme = 6;
                avecChoixConnexion = true;
            } else if (espace_id === "13") {
                espaceNom += "Vie scolaire";
            } else if (espace_id === "2") {
                espaceNom += "Parents";
                avecRecuperationInfosConnexion = true;
            } else if (espace_id === "25") {
                espaceNom += "Accompagnants";
            }

            var periodes = get_metadata().Periodes;
            const listePeriodes = [];

            for (const [key, value] of Object.entries(periodes)) {
                const L = value.name;
                const N = "0001";
                const G = 1;
                const periodeNotation = parseInt(key.slice(1)) - 1;
                const dateDebut = {
                    "_T": 7,
                    "V": value.from
                };
                const dateFin = {
                    "_T": 7,
                    "V": value.to
                };

                listePeriodes.push({
                    L,
                    N,
                    G,
                    periodeNotation,
                    dateDebut,
                    dateFin
                });
            }

            encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, newIv).then((enryptedNumeroOrdre) => {
                const response = {
                    nom: 'FonctionParametres',
                    session: parseInt(session_id),
                    numeroOrdre: enryptedNumeroOrdre,
                    donneesSec: {
                        donnees: {
                            // ... Informations utiles sur l'école, l'emploi du temps, les paramètres, etc.
                            AvecEspaceMobile: false, // TODO
                            Nom: espaceNom,
                            PageEtablissement: "pageetablissement.html",
                            Theme: theme,
                            anneeScolaire: getCurrentSchoolYear(),
                            avecPagePubliqueEtab: false,
                            URLMobile: "mobile.html",
                            avecMembre: false,
                            genreImageConnexion: 4,
                            labelLienProduit: "Aller sur le site de Pronote",
                            listePolices: {
                                "_T": 24,
                                "V": [{
                                    "L": "@Malgun Gothic"
                                }, {
                                    "L": "@Microsoft JhengHei"
                                }, {
                                    "L": "@Microsoft JhengHei UI"
                                }, {
                                    "L": "@Microsoft YaHei"
                                }, {
                                    "L": "@Microsoft YaHei UI"
                                }, {
                                    "L": "@NSimSun"
                                }, {
                                    "L": "@SimSun"
                                }, {
                                    "L": "@Yu Gothic Medium"
                                }, {
                                    "L": "@Yu Gothic UI"
                                }, {
                                    "L": "Arial"
                                }, {
                                    "L": "Arial Black"
                                }, {
                                    "L": "Bahnschrift"
                                }, {
                                    "L": "Bahnschrift Condensed"
                                }, {
                                    "L": "Bahnschrift Light"
                                }, {
                                    "L": "Bahnschrift Light Condensed"
                                }, {
                                    "L": "Bahnschrift Light SemiCondensed"
                                }, {
                                    "L": "Bahnschrift SemiBold"
                                }, {
                                    "L": "Bahnschrift SemiBold Condensed"
                                }, {
                                    "L": "Bahnschrift SemiBold SemiConden"
                                }, {
                                    "L": "Bahnschrift SemiCondensed"
                                }, {
                                    "L": "Bahnschrift SemiLight"
                                }, {
                                    "L": "Bahnschrift SemiLight Condensed"
                                }, {
                                    "L": "Bahnschrift SemiLight SemiConde"
                                }, {
                                    "L": "Calibri"
                                }, {
                                    "L": "Calibri Light"
                                }, {
                                    "L": "Cambria"
                                }, {
                                    "L": "Cambria Math"
                                }, {
                                    "L": "Comic Sans MS"
                                }, {
                                    "L": "Consolas"
                                }, {
                                    "L": "Courier"
                                }, {
                                    "L": "Courier New"
                                }, {
                                    "L": "Ebrima"
                                }, {
                                    "L": "Fixedsys"
                                }, {
                                    "L": "Gadugi"
                                }, {
                                    "L": "Georgia"
                                }, {
                                    "L": "Ink Free"
                                }, {
                                    "L": "Javanese Text"
                                }, {
                                    "L": "Leelawadee UI"
                                }, {
                                    "L": "Leelawadee UI Semilight"
                                }, {
                                    "L": "Lucida Console"
                                }, {
                                    "L": "Malgun Gothic"
                                }, {
                                    "L": "Microsoft Himalaya"
                                }, {
                                    "L": "Microsoft JhengHei"
                                }, {
                                    "L": "Microsoft JhengHei UI"
                                }, {
                                    "L": "Microsoft New Tai Lue"
                                }, {
                                    "L": "Microsoft PhagsPa"
                                }, {
                                    "L": "Microsoft Tai Le"
                                }, {
                                    "L": "Microsoft YaHei"
                                }, {
                                    "L": "Microsoft YaHei UI"
                                }, {
                                    "L": "Microsoft Yi Baiti"
                                }, {
                                    "L": "Modern"
                                }, {
                                    "L": "Mongolian Baiti"
                                }, {
                                    "L": "MS Sans Serif"
                                }, {
                                    "L": "MS Serif"
                                }, {
                                    "L": "MV Boli"
                                }, {
                                    "L": "Myanmar Text"
                                }, {
                                    "L": "Nirmala UI"
                                }, {
                                    "L": "Nirmala UI Semilight"
                                }, {
                                    "L": "NSimSun"
                                }, {
                                    "L": "Roman"
                                }, {
                                    "L": "Script"
                                }, {
                                    "L": "Segoe MDL2 Assets"
                                }, {
                                    "L": "Segoe Print"
                                }, {
                                    "L": "Segoe UI"
                                }, {
                                    "L": "Segoe UI Black"
                                }, {
                                    "L": "Segoe UI Emoji"
                                }, {
                                    "L": "Segoe UI Historic"
                                }, {
                                    "L": "Segoe UI Light"
                                }, {
                                    "L": "Segoe UI Semibold"
                                }, {
                                    "L": "Segoe UI Semilight"
                                }, {
                                    "L": "Segoe UI Symbol"
                                }, {
                                    "L": "SimSun"
                                }, {
                                    "L": "Small Fonts"
                                }, {
                                    "L": "System"
                                }, {
                                    "L": "Terminal"
                                }, {
                                    "L": "Times New Roman"
                                }, {
                                    "L": "Trebuchet MS"
                                }, {
                                    "L": "Verdana"
                                }, {
                                    "L": "Webdings"
                                }, {
                                    "L": "Wingdings"
                                }, {
                                    "L": "Yu Gothic Medium"
                                }, {
                                    "L": "Yu Gothic UI"
                                }]
                            },
                            logoProduitCss: "Image_Logo_PronoteBarreHaut",
                            mentionsPagesPubliques: {
                                "lien": {
                                    "_T": 21,
                                    "V": ""
                                }
                            },
                            pourNouvelleCaledonie: false,
                            urlImageConnexion: "",
                            DateServeurHttp: {
                                V: dateServeurHttp,
                                _T: 7
                            },
                            General: {
                                ActivationMessagerieEntreParents: false,
                                AfficherAbbreviationNiveauDAcquisition: false,
                                AnneeScolaire: getCurrentSchoolYear(),
                                AvecChoixConnexion: avecChoixConnexion,
                                AvecElevesRattaches: false,
                                AvecEvaluationHistorique: false,
                                AvecGestionNiveauxCECRL: true,
                                AvecHeuresPleinesApresMidi: true,
                                AvecRecuperationInfosConnexion: avecRecuperationInfosConnexion,
                                BaremeMaxDevoirs: {
                                    V: "200",
                                    _T: 10
                                },
                                BaremeNotation: {
                                    V: "20",
                                    _T: 10
                                },
                                DemiJourneesOuvrees: [{
                                        V: "[0..5]",
                                        _T: 26
                                    },
                                    {
                                        V: "[0,1,3..5]",
                                        _T: 26
                                    }
                                ],
                                DerniereDate: listePeriodes[listePeriodes.length - 1].dateFin,
                                DomainesFrequences: [{
                                        V: "[1..8,11..16,19..23,26..32,35..45]",
                                        _T: 8
                                    },
                                    {
                                        V: "[1,3,5,7,11,13,15,19,21,23,27,29,31,35,37,39,41,43,45]",
                                        _T: 8
                                    },
                                    {
                                        V: "[2,4,6,8,12,14,16,20,22,26,28,30,32,36,38,40,42,44]",
                                        _T: 8
                                    }
                                ],
                                DureeSequence: 0.0416666666666667, // To understand xD
                                GestionParcoursExcellence: true,
                                JourOuvre: {
                                    V: getDateToday(),
                                    _T: 7
                                },
                                // JourOuvre : TODO (Jour ouverture étab après vacances ou alors prochain jour de cours, ou le jour d'aujourd'hui si il y a cours)
                                JoursDemiPension: {
                                    V: "[0..4]",
                                    _T: 26
                                },
                                JoursOuvres: {
                                    V: "[1..5]",
                                    _T: 11
                                },
                                LibellesFrequences: [
                                    "",
                                    "Q1",
                                    "Q2",
                                    ""
                                ],
                                ListeHeures: {
                                    V: [{
                                        "G": 0,
                                        "L": "08h10"
                                    }, {
                                        "G": 1,
                                        "L": "08h40",
                                        "A": false
                                    }, {
                                        "G": 2,
                                        "L": "09h05"
                                    }, {
                                        "G": 3,
                                        "L": "09h35",
                                        "A": false
                                    }, {
                                        "G": 4,
                                        "L": "10h15"
                                    }, {
                                        "G": 5,
                                        "L": "10h45",
                                        "A": false
                                    }, {
                                        "G": 6,
                                        "L": "11h10"
                                    }, {
                                        "G": 7,
                                        "L": "11h40",
                                        "A": false
                                    }, {
                                        "G": 8,
                                        "L": "12h05"
                                    }, {
                                        "G": 9,
                                        "L": "12h35",
                                        "A": false
                                    }, {
                                        "G": 10,
                                        "L": "13h00"
                                    }, {
                                        "G": 11,
                                        "L": "13h30",
                                        "A": false
                                    }, {
                                        "G": 12,
                                        "L": "13h55"
                                    }, {
                                        "G": 13,
                                        "L": "14h25",
                                        "A": false
                                    }, {
                                        "G": 14,
                                        "L": "15h05"
                                    }, {
                                        "G": 15,
                                        "L": "15h35",
                                        "A": false
                                    }, {
                                        "G": 16,
                                        "L": "16h00"
                                    }, {
                                        "G": 17,
                                        "L": "16h30",
                                        "A": false
                                    }, {
                                        "G": 18,
                                        "L": "16h55"
                                    }, {
                                        "G": 19,
                                        "L": "17h25",
                                        "A": false
                                    }, {
                                        "G": 20,
                                        "L": "17h50"
                                    }]
                                },
                                "ListeHeuresFin": {
                                    "_T": 24,
                                    "V": [{
                                        "G": 0,
                                        "L": "08h40",
                                        "A": false
                                    }, {
                                        "G": 1,
                                        "L": "09h05",
                                        "A": false
                                    }, {
                                        "G": 2,
                                        "L": "09h35",
                                        "A": false
                                    }, {
                                        "G": 3,
                                        "L": "10h00"
                                    }, {
                                        "G": 4,
                                        "L": "10h45",
                                        "A": false
                                    }, {
                                        "G": 5,
                                        "L": "11h10",
                                        "A": false
                                    }, {
                                        "G": 6,
                                        "L": "11h40",
                                        "A": false
                                    }, {
                                        "G": 7,
                                        "L": "12h05",
                                        "A": false
                                    }, {
                                        "G": 8,
                                        "L": "12h35",
                                        "A": false
                                    }, {
                                        "G": 9,
                                        "L": "13h00",
                                        "A": false
                                    }, {
                                        "G": 10,
                                        "L": "13h30",
                                        "A": false
                                    }, {
                                        "G": 11,
                                        "L": "13h55",
                                        "A": false
                                    }, {
                                        "G": 12,
                                        "L": "14h25",
                                        "A": false
                                    }, {
                                        "G": 13,
                                        "L": "14h50",
                                        "A": false
                                    }, {
                                        "G": 14,
                                        "L": "15h35"
                                    }, {
                                        "G": 15,
                                        "L": "16h00",
                                        "A": false
                                    }, {
                                        "G": 16,
                                        "L": "16h30",
                                        "A": false
                                    }, {
                                        "G": 17,
                                        "L": "16h55",
                                        "A": false
                                    }, {
                                        "G": 18,
                                        "L": "17h25",
                                        "A": false
                                    }, {
                                        "G": 19,
                                        "L": "17h50"
                                    }, {
                                        "G": 20,
                                        "L": "17h50",
                                        "A": false
                                    }],
                                    _T: 24
                                },
                                ListeHeuresFin: {
                                    V: [{
                                        "G": 0,
                                        "L": "08h40",
                                        "A": false
                                    }, {
                                        "G": 1,
                                        "L": "09h05",
                                        "A": false
                                    }, {
                                        "G": 2,
                                        "L": "09h35",
                                        "A": false
                                    }, {
                                        "G": 3,
                                        "L": "10h00"
                                    }, {
                                        "G": 4,
                                        "L": "10h45",
                                        "A": false
                                    }, {
                                        "G": 5,
                                        "L": "11h10",
                                        "A": false
                                    }, {
                                        "G": 6,
                                        "L": "11h40",
                                        "A": false
                                    }, {
                                        "G": 7,
                                        "L": "12h05",
                                        "A": false
                                    }, {
                                        "G": 8,
                                        "L": "12h35",
                                        "A": false
                                    }, {
                                        "G": 9,
                                        "L": "13h00",
                                        "A": false
                                    }, {
                                        "G": 10,
                                        "L": "13h30",
                                        "A": false
                                    }, {
                                        "G": 11,
                                        "L": "13h55",
                                        "A": false
                                    }, {
                                        "G": 12,
                                        "L": "14h25",
                                        "A": false
                                    }, {
                                        "G": 13,
                                        "L": "14h50",
                                        "A": false
                                    }, {
                                        "G": 14,
                                        "L": "15h35"
                                    }, {
                                        "G": 15,
                                        "L": "16h00",
                                        "A": false
                                    }, {
                                        "G": 16,
                                        "L": "16h30",
                                        "A": false
                                    }, {
                                        "G": 17,
                                        "L": "16h55",
                                        "A": false
                                    }, {
                                        "G": 18,
                                        "L": "17h25",
                                        "A": false
                                    }, {
                                        "G": 19,
                                        "L": "17h50"
                                    }, {
                                        "G": 20,
                                        "L": "17h50",
                                        "A": false
                                    }],
                                    _T: 24
                                },
                                ListeNiveauxDAcquisitions: {
                                    V: [{
                                        "L": "Aucune évaluation",
                                        "N": "0",
                                        "G": 0,
                                        "P": 0,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Aucun",
                                                "abbreviation": ""
                                            }, {
                                                "G": 2,
                                                "L": "Aucun",
                                                "abbreviation": ""
                                            }]
                                        },
                                        "positionJauge": 5,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "",
                                        "raccourci": "0",
                                        "raccourciPositionnement": "0"
                                    }, {
                                        "L": "Très bonne maîtrise",
                                        "N": "97F24A8180F4B8",
                                        "G": 1,
                                        "P": 1,
                                        "positionJauge": 11,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "A+",
                                        "raccourci": "4",
                                        "raccourciPositionnement": "4",
                                        "couleur": "#008000",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "50"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "50"
                                        },
                                        "estAcqui": true,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": true,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Très bonne maîtrise",
                                                "abbreviation": "4",
                                                "abbreviationAvecPrefixe": "Pos.4"
                                            }, {
                                                "G": 2,
                                                "L": "Objectifs dépassés",
                                                "abbreviation": "4",
                                                "abbreviationAvecPrefixe": "Pos.4"
                                            }]
                                        }
                                    }, {
                                        "L": "Maîtrise satisfaisante",
                                        "N": "971C498180F424",
                                        "G": 2,
                                        "P": 2,
                                        "positionJauge": 10,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "A",
                                        "raccourci": "3",
                                        "raccourciPositionnement": "3",
                                        "couleur": "#45B851",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "40"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "40"
                                        },
                                        "estAcqui": true,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": true,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Maîtrise satisfaisante",
                                                "abbreviation": "3",
                                                "abbreviationAvecPrefixe": "Pos.3"
                                            }, {
                                                "G": 2,
                                                "L": "Objectifs atteints",
                                                "abbreviation": "3",
                                                "abbreviationAvecPrefixe": "Pos.3"
                                            }]
                                        }
                                    }, {
                                        "L": "Presque maîtrisé",
                                        "N": "97FA488180F40D",
                                        "G": 3,
                                        "P": 3,
                                        "positionJauge": 9,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[]"
                                        },
                                        "abbreviation": "B",
                                        "couleur": "#ADDE1F",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "33"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": ""
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": true,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Presque maîtrisé",
                                                "abbreviation": "",
                                                "abbreviationAvecPrefixe": ""
                                            }, {
                                                "G": 2,
                                                "L": "Presque maîtrisé",
                                                "abbreviation": "",
                                                "abbreviationAvecPrefixe": ""
                                            }]
                                        }
                                    }, {
                                        "L": "Maîtrise fragile",
                                        "N": "97194F8180F4AA",
                                        "G": 4,
                                        "P": 4,
                                        "positionJauge": 8,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "C",
                                        "raccourci": "2",
                                        "raccourciPositionnement": "2",
                                        "couleur": "#FFDA01",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "25"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "25"
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": true,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Maîtrise fragile",
                                                "abbreviation": "2",
                                                "abbreviationAvecPrefixe": "Pos.2"
                                            }, {
                                                "G": 2,
                                                "L": "Objectifs partiellement atteints",
                                                "abbreviation": "2",
                                                "abbreviationAvecPrefixe": "Pos.2"
                                            }]
                                        }
                                    }, {
                                        "L": "Début de maîtrise",
                                        "N": "97EE4E8180F42B",
                                        "G": 5,
                                        "P": 5,
                                        "positionJauge": 7,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[]"
                                        },
                                        "abbreviation": "D",
                                        "couleur": "#FF880F",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "18"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": ""
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": true,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Début de maîtrise",
                                                "abbreviation": "",
                                                "abbreviationAvecPrefixe": ""
                                            }, {
                                                "G": 2,
                                                "L": "Début de maîtrise",
                                                "abbreviation": "",
                                                "abbreviationAvecPrefixe": ""
                                            }]
                                        }
                                    }, {
                                        "L": "Maîtrise insuffisante",
                                        "N": "976F4D8180F4C9",
                                        "G": 6,
                                        "P": 6,
                                        "positionJauge": 6,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "E",
                                        "raccourci": "1",
                                        "raccourciPositionnement": "1",
                                        "couleur": "#F80A0A",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "10"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "10"
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": true,
                                        "estNotantPourTxReussite": true,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Maîtrise insuffisante",
                                                "abbreviation": "1",
                                                "abbreviationAvecPrefixe": "Pos.1"
                                            }, {
                                                "G": 2,
                                                "L": "Objectifs non atteints",
                                                "abbreviation": "1",
                                                "abbreviationAvecPrefixe": "Pos.1"
                                            }]
                                        }
                                    }, {
                                        "L": "Absent",
                                        "N": "97E04C8180F46E",
                                        "G": 7,
                                        "P": 7,
                                        "positionJauge": 4,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "Abs",
                                        "raccourci": "a",
                                        "raccourciPositionnement": "a",
                                        "couleur": "#FFFFFF",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "|1"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "|1"
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": false,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Absent",
                                                "abbreviation": "Abs",
                                                "abbreviationAvecPrefixe": "Abs"
                                            }, {
                                                "G": 2,
                                                "L": "Absent",
                                                "abbreviation": "Abs",
                                                "abbreviationAvecPrefixe": "Abs"
                                            }]
                                        }
                                    }, {
                                        "L": "Non évalué",
                                        "N": "97CD438180F4CE",
                                        "G": 8,
                                        "P": 8,
                                        "positionJauge": 3,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[1]"
                                        },
                                        "abbreviation": "Ne",
                                        "raccourci": "n",
                                        "raccourciPositionnement": "n",
                                        "couleur": "#FFFFFF",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "|3"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": ""
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": false,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Non évalué",
                                                "abbreviation": "Ne",
                                                "abbreviationAvecPrefixe": "Ne"
                                            }, {
                                                "G": 2,
                                                "L": "Non évalué",
                                                "abbreviation": "Ne",
                                                "abbreviationAvecPrefixe": "Ne"
                                            }]
                                        }
                                    }, {
                                        "L": "Dispensé",
                                        "N": "97F5428180F414",
                                        "G": 9,
                                        "P": 9,
                                        "positionJauge": 2,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[0,1]"
                                        },
                                        "abbreviation": "Dsp",
                                        "raccourci": "d",
                                        "raccourciPositionnement": "d",
                                        "couleur": "#FFFFFF",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "|2"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "|2"
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": false,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Dispensé",
                                                "abbreviation": "Dsp",
                                                "abbreviationAvecPrefixe": "Dsp"
                                            }, {
                                                "G": 2,
                                                "L": "Dispensé",
                                                "abbreviation": "Dsp",
                                                "abbreviationAvecPrefixe": "Dsp"
                                            }]
                                        }
                                    }, {
                                        "L": "Non rendu",
                                        "N": "97AA418180F42D",
                                        "G": 10,
                                        "P": 10,
                                        "positionJauge": 1,
                                        "actifPour": {
                                            "_T": 26,
                                            "V": "[]"
                                        },
                                        "abbreviation": "Nr",
                                        "couleur": "#FFFFFF",
                                        "ponderation": {
                                            "_T": 10,
                                            "V": "|5"
                                        },
                                        "nombrePointsBrevet": {
                                            "_T": 10,
                                            "V": "|5"
                                        },
                                        "estAcqui": false,
                                        "estNonAcqui": false,
                                        "estNotantPourTxReussite": false,
                                        "listePositionnements": {
                                            "_T": 24,
                                            "V": [{
                                                "G": 1,
                                                "L": "Non rendu",
                                                "abbreviation": "Nr",
                                                "abbreviationAvecPrefixe": "Nr"
                                            }, {
                                                "G": 2,
                                                "L": "Non rendu",
                                                "abbreviation": "Nr",
                                                "abbreviationAvecPrefixe": "Nr"
                                            }]
                                        }
                                    }],
                                    _T: 24
                                },
                                ListePeriodes: listePeriodes,
                                NbJDecalageDatePublicationParDefaut: 0,
                                NbJDecalagePublicationAuxParents: 0,
                                NeComptabiliserQueEvalsAnneeScoDsValidAuto: false,
                                NomEtablissement: metadata.title,
                                NomEtablissementConnexion: metadata.name,
                                PlaceDemiJourneeAbsence: 10,
                                PlacesParHeure: 2,
                                PlacesParJour: 20,
                                Police: "arial,helvetica,sans-serif",
                                PondererMatieresSelonLeurCoeffDsDomaine: false,
                                PremierLundi: {
                                    V: getLastMondayOfAugust(getFirstSchoolYear()),
                                    _T: 7
                                },
                                PremiereDate: {
                                    V: getFirstWeekdayOfSeptember(getFirstSchoolYear()),
                                    _T: 7
                                },
                                PremiereHeure: {
                                    V: "30/12/1899 8:10:00"
                                },
                                SansValidationNivIntermediairesDsValidAuto: false,
                                TailleMaxAppreciation: [
                                    255,
                                    300,
                                    255,
                                    255,
                                    300,
                                    300,
                                    255,
                                    255,
                                    255,
                                    255,
                                    255
                                ],
                                TaillePolice: 11,
                                UrlAide: {
                                    "_T": 23,
                                    "V": "https://doc.index-education.com/index.php?p=FR&lg=fr&l=pn&m=2022&e=16&c=%s&cl=%s"
                                },
                                activationDemiPension: true,
                                afficherSequences: false,
                                avecForum: true,
                                couleurActiviteLangagiere: "#800000",
                                dateDebutPremierCycle: {
                                    V: getLastMondayOfAugust(getFirstSchoolYear()),
                                    _T: 7
                                },
                                debutDemiPension: 6,
                                estHebergeEnFrance: true,
                                finDemiPension: 12,
                                genresRenduTAFValable: {
                                    V: "[0..3]",
                                    _T: 26
                                },
                                grillesEDTEnCycle: 0,
                                joursOuvresParCycle: 5,
                                langID: 1036,
                                langue: "fr",
                                listeAnnotationsAutorisees: {
                                    V: "[1..5]",
                                    _T: 26
                                },
                                listeJoursFeries: {
                                    "_T": 24,
                                    "V": [{
                                        "L": "Vacances de la Toussaint",
                                        "N": "7784327BCD3AAC",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "23/10/2022"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "06/11/2022"
                                        }
                                    }, {
                                        "L": "Armistice 1918",
                                        "N": "77C2317BCD3A65",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "11/11/2022"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "11/11/2022"
                                        }
                                    }, {
                                        "L": "Vacances de Noël",
                                        "N": "7735307BCD3A48",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "18/12/2022"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "02/01/2023"
                                        }
                                    }, {
                                        "L": "Vacances d'hiver",
                                        "N": "7781377BCD3ACF",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "05/02/2023"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "19/02/2023"
                                        }
                                    }, {
                                        "L": "Vacances de printemps",
                                        "N": "77D1367BCD3AB2",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "09/04/2023"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "23/04/2023"
                                        }
                                    }, {
                                        "L": "Fête du travail",
                                        "N": "7720357BCD3A5A",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "01/05/2023"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "01/05/2023"
                                        }
                                    }, {
                                        "L": "Victoire 1945",
                                        "N": "7719347BCD3A42",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "08/05/2023"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "08/05/2023"
                                        }
                                    }, {
                                        "L": "Ascension",
                                        "N": "77073B7BCD3AC5",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "18/05/2023"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "21/05/2023"
                                        }
                                    }, {
                                        "L": "Pentecôte",
                                        "N": "779D3A7BCD3A85",
                                        "dateDebut": {
                                            "_T": 7,
                                            "V": "28/05/2023"
                                        },
                                        "dateFin": {
                                            "_T": 7,
                                            "V": "29/05/2023"
                                        }
                                    }]
                                },
                                // TODO : listeJoursFeries, j'ai juste copié collé
                                listeLangues: {
                                    V: [{
                                            "langID": 1036,
                                            "description": "Français"
                                        },
                                        {
                                            "langID": 1033,
                                            "description": "English"
                                        },
                                        {
                                            "langID": 3082,
                                            "description": "Español"
                                        },
                                        {
                                            "langID": 1040,
                                            "description": "Italiano"
                                        }
                                    ],
                                    _T: 24
                                },
                                maskTelephone: "!99 99 99 99 99 99;0;–",
                                maxBaremeQuestionQCM: 20,
                                maxECTS: 10000,
                                maxNbPointQCM: 100,
                                maxNiveauQCM: 3,
                                millesime: getFirstSchoolYear(),
                                minBaremeQuestionQCM: 1,
                                nomCookieAppli: "validationAppliMobile",
                                numeroPremiereSemaine: 1,
                                premierJourSemaine: 2,
                                publierMentions: true,
                                recreations: {
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
                                sequences: [
                                    "1",
                                    "2",
                                    "3",
                                    "4",
                                    "5",
                                    "6",
                                    "7",
                                    "8",
                                    "9",
                                    "10"
                                ],
                                setOfJoursCycleOuvre: {
                                    "_T": 26,
                                    "V": "[0..4]"
                                },
                                tailleCommentaireDevoir: 40,
                                tailleCommentaireUrlCours: 255,
                                tailleLibelleElementGrilleCompetence: 500,
                                tailleLibelleUrlCours: 60,
                                tailleMaxEnregistrementAudioRenduTAF: 3,
                                urlAccesTwitter: { // Intéressant non ?
                                    "_T": 23,
                                    "V": ""
                                },
                                urlAccesVideos: {
                                    "_T": 23,
                                    "V": ""
                                },
                                urlCanope: {
                                    "_T": 23,
                                    "V": ""
                                },
                                urlFAQEnregistrementDoubleAuth: {
                                    "_T": 23,
                                    "V": "https://www.index-education.com/redirect.php?produit=pn&page=DoubleAuthentification&version=2022.0.3.0&distrib=FR&lg=fr&flag=Espace_Administrateur"
                                },
                                urlLogo: { // TODO
                                    "_T": 23,
                                    "V": "fichierurlpublique/logo.png?param=AAB670BD59635CFD73D83534927CA89D53FA7E7F513FB7D2ACDDB0BFB1BC2135ED47F6679AFF5E6C06D1E62BB5C9804B7674EC2BED89E4789B3D43A7BD5E0B27B6D5BE5BA0B9696BA63BCE9EAD09B5D5"
                                },
                                urlSiteIndexEducation: {
                                    "_T": 23,
                                    "V": "https://www.index-education.com/redirect.php?produit=pn&page=LogoPronote&version=2022.0.3.0&distrib=FR&lg=fr&flag=Espace_Administrateur"
                                },
                                urlSiteInfosHebergement: {
                                    "_T": 23,
                                    "V": "https://www.index-education.com/redirect.php?produit=pn&page=InfosHeb&version=2022.0.3.0&distrib=FR&lg=fr&flag=Espace_Administrateur"
                                },
                                version: "FOSSNOTE 2022 - 0.3.0 gestion de vie scolaire, notes, compétences, absences/retards/dispenses, incidents/punitions/sanctions, stages... INDEX ÉDUCATION",
                                versionPN: "2022.0.3.0",

                            }
                        },
                        nom: 'FonctionParametres'
                    }
                };
                res.json(response);
                return true;
            }).catch((err) => {
                console.log(err);
            });
        } else {
            
        }
    }).catch((error) => {
        console.error(error);
    });
}

module.exports = {
    bind
};