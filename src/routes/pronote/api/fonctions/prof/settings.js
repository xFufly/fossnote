const forge = require('node-forge');

const {
    get_metadata,
    getCurrentPeriod
} = require('../../../../../helpers');

const {
    decryptRSA,
    encryptAES
} = require('../../../../../cipher');

const session = require('../../../../../databases/session');
const eleves = require('../../../../../databases/eleves');
const teachers = require('../../../../../databases/teachers');

async function bind(req, res, currentSession) {

    const {
        espace_id,
        session_id,
    } = req.params;

    const metadata = get_metadata();
    const date = new Date();
    const dateServeurHttp = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const periodes = get_metadata().Periodes;
    const currentPeriod = getCurrentPeriod(periodes);

    encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv).then(async (enryptedNumeroOrdre) => {
        const challengeInfos = JSON.parse(currentSession.challenge);
        var user = await teachers.getTeacher(challengeInfos.username.toLowerCase());
        var fullName = user.nom + " " + user.prenom;
        if (user.genre === "F") {
            fullName = "Mme. " + fullName;
        } else if (user.genre === "M") {
            fullName = "M. " + fullName;
        }
        const response = {
            "nom": 'ParametresUtilisateur',
            "session": parseInt(session_id),
            "numeroOrdre": enryptedNumeroOrdre,
            "donneesSec": {
                "nom": 'ParametresUtilisateur',
                "_Signature_": {
                    "listeDonnees": {
                      "0": {
                        "_T": 24,
                        "V": []
                      }
                    },
                    "notifications": {
                      "compteurCentraleNotif": 0,
                      "statutConnexion": 0
                    },
                    "actualisationMessage": true,
                    "notificationsCommunication": [
                      {
                        "onglet": 131,
                        "nb": 0
                      },
                      {
                        "onglet": 104,
                        "nb": 0
                      },
                      {
                        "onglet": 8,
                        "nb": 0
                      }
                    ],
                    "notificationsKiosque": true
                },
                "donnees": {
                    "ressource": {
                      "L": fullName,
                      "N": "1100" + user.id,
                      "G": 3,
                      "notificationsPush": false,
                      "avecPhoto": true,
                      "listeSessions": {
                        "_T": 24,
                        "V": [] // TO UNDERSTAND
                      },
                      "Etablissement": {
                        "_T": 24,
                        "V": {
                          "L": "SITE DE DEMONSTRATION",
                          "N": "5367E1DF744069"
                        }
                      }
                    },
                    "UrlInstallClient": {
                      "_T": 23,
                      "V": "https://www.index-education.com/redirect.php?produit=pn&page=TelechClient&version=2022.0.3.179&distrib=FR&lg=fr&flag=espace"
                    },
                    "UrlParamClient": {
                      "_T": 23,
                      "V": "ParamClient.pcprn"
                    }/*,
                    "designationClient": { // TODO / TO UNDERSTAND
                      "_T": 23, 
                      "V": ""
                    }*/,
                    "listeClasses": { // TODO | To sync with a db
                      "_T": 24,
                      "V": [
                        {
                          "L": "3A",
                          "N": "63001",
                          "G": 2,
                          "enseigne": true
                        },
                        {
                          "L": "4B",
                          "N": "63002",
                          "G": 2,
                          "enseigne": true
                        },
                        {
                          "L": "6A",
                          "N": "63003",
                          "G": 2
                        }
                      ]
                    },
                    "listeMatieres": { // TODO | To sync with a db
                      "_T": 24,
                      "V": [
                        {
                          "L": "Maths",
                          "N": "820012",
                          "code": "ACC FR",
                          "couleur": "#C0C0C0",
                          "estEnseignee": true,
                          "estUtilise": true
                        },
                        {
                          "L": "Anglais",
                          "N": "820013",
                          "code": "ACC HI",
                          "couleur": "#C0C0C0",
                          "estEnseignee": false,
                          "estUtilise": true
                        }
                      ]
                    },
                    "listeNiveaux": { // TODO | To sync with a db
                      "_T": 24,
                      "V": [
                        {
                          "L": "3EME",
                          "N": "96001",
                          "estEnseigne": true
                        },
                        {
                          "L": "4EME",
                          "N": "96002",
                          "estEnseigne": false
                        }
                      ]
                    },
                    "listeInformationsEtablissements": {
                      "_T": 24,
                      "V": [
                        {
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
                          "avecInformations": true
                        }
                      ]
                    },
                    "domaineVerrou": {
                      "_T": 8,
                      "V": "[]"
                    },
                    "parametresUtilisateurBase": {
                      "_T": 24,
                      "V": {
                        "optionPublicationCDT": 1,
                        "partagePJAutorisee": true
                      }
                    },
                    "parametresUtilisateur": {
                      "version": 1,
                      "EDT": {
                        "afficherCoursAnnules": true,
                        "afficherListeEleves": true,
                        "couleurClasse": true,
                        "axeInverseEDT": false,
                        "axeInversePlanningHebdo": true,
                        "axeInversePlanningJour": false,
                        "axeInversePlanningJour2": false,
                        "nbJours": 0,
                        "nbRessources": 0,
                        "nbJoursEDT": 0,
                        "nbSequences": 0,
                        "Prefs": {
                          "0": {
                            "1": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "2": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "3": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "4": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "17": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "34": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "80": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            }
                          },
                          "1": {
                            "1": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "2": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "3": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "4": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "17": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "34": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            },
                            "80": {
                              "modele": -1,
                              "placeDebut": 0,
                              "placeFin": 19,
                              "nbPas": 1,
                              "joursOuvres": {
                                "_T": 26,
                                "V": "[0..4]"
                              }
                            }
                          }
                        }
                      },
                      "CDT": {
                        "Navigation": {
                          "MatiereIdentique": true,
                          "TypeCours": 0
                        },
                        "TAF": {
                          "ActiverMiseEnForme": false,
                          "Duree": 0,
                          "NiveauDifficulte": 0
                        },
                        "ElementProgramme": {
                          "AutorisationFonctionnelleElementProgramme": true,
                          "ActiverSaisie": false,
                          "TypeAffichage": 0,
                          "AfficherEltDuProfesseur": false,
                          "AfficherBO": true,
                          "AfficherPartage": true,
                          "AfficherCompetences": false,
                          "FiltreEltsTravailles": false,
                          "NbFiltreEltsTravailles": 5,
                          "ComptabiliserPourBulletin": true
                        },
                        "Planning": {
                          "UniqTitre": false
                        },
                        "ParcoursEducatifs": {
                          "ActiverSaisie": false,
                          "AutorisationFonctionnelleParcoursEducatifs": true
                        }
                      },
                      "Incidents": {
                        "Cols": [
                          {
                            "id": "0"
                          },
                          {
                            "id": "1"
                          },
                          {
                            "id": "2"
                          },
                          {
                            "id": "3"
                          },
                          {
                            "id": "4"
                          },
                          {
                            "id": "5",
                            "visible": false
                          },
                          {
                            "id": "6",
                            "visible": false
                          },
                          {
                            "id": "7",
                            "visible": false
                          },
                          {
                            "id": "10",
                            "visible": false
                          }
                        ]
                      },
                      "CalculPositionnementEleveParService": {
                        "ModeCalcul": 0,
                        "NDernieresEvaluations": 5,
                        "NMeilleuresEvaluations": 5
                      },
                      "CalculPositionnementEleveParClasse": {
                        "ModeCalcul": 0,
                        "NDernieresEvaluations": 5,
                        "NMeilleuresEvaluations": 5
                      },
                      "widgets": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                      ],
                      "demarrerSurPageAccueil": true,
                      "utiliserNotification": false,
                      "masquerDonneesAutresProfesseurs": true,
                      "avecGestionDesThemes": true,
                      "onglet": 113,
                      "theme": {
                        "theme": 6
                      },
                      "Communication": {
                        "DiscussionNonLues": false
                      },
                      "avecTransformateurFlux": true
                    },
                    "autorisationsSession": {
                      "fonctionnalites": {
                        "appelSaisirMotifJustifDAbsence": true,
                        "gestionTwitter": true,
                        "attestationEtendue": false,
                        "gestionARBulletins": true,
                        "avecTransformationFluxFichier": true
                      }
                    },
                    "autorisations": {
                      "AssistantSaisieAppreciations": true,
                      "VoirTousLesEleves": true,
                      "ConsulterIdentiteEleve": true,
                      "ConsulterFichesResponsables": true,
                      "ConsulterPhotosEleves": true,
                      "AvecAffectationElevesGroupesGAEV": true,
                      "AvecSaisieProjetIndividuel": true,
                      "AvecSaisieAttestations": true,
                      "AvecDiscussion": true,
                      "AvecDiscussionPersonnels": true,
                      "AvecDiscussionProfesseurs": true,
                      "AvecDiscussionParents": true,
                      "AvecDiscussionEleves": true,
                      "avecMessageInstantane": true,
                      "estDestinataireChat": true,
                      "AvecContactVS": true,
                      "lancerAlertesPPMS": true,
                      "AvecDiscussionAvancee": true,
                      "avecSaisieParcoursPedagogique": true,
                      "DomaineRecapitulatifAbsences": {
                        "_T": 8,
                        "V": "[1..52]"
                      },
                      "AvecSaisieAppelEtVS": true,
                      "AvecSaisieCours": true,
                      "AvecSaisieHorsCours": true,
                      "AvecSaisieSurGrille": true,
                      "AvecSaisieAbsence": true,
                      "AvecSaisieRetard": true,
                      "AvecSaisieMotifRetard": true,
                      "AvecSaisiePassageInfirmerie": true,
                      "AvecSaisieExclusion": true,
                      "AvecSaisiePunition": true,
                      "AvecSaisieObservation": true,
                      "AvecConsultationDefautCarnet": true,
                      "AvecSaisieDefautCarnet": true,
                      "AvecSaisieObservationsParents": true,
                      "AvecSaisieEncouragements": true,
                      "AvecAccesAuxEvenementsAutresCours": true,
                      "DateSaisieAbsence": [], // TO UNDERSTAND
                      "AvecSaisieEvaluations": true,
                      "AvecSaisieItems": true,
                      "AvecValidationCompetences": true,
                      "AutoriserCommunicationsToutesClasses": true,
                      "AvecSaisieAgenda": true,
                      "AvecSaisieDevoirs": true,
                      "AvecSaisieActualite": true,
                      "avecPublicationListeDiffusion": true,
                      "CreerDossiersVS": true,
                      "ModifierDossiersVS": true,
                      "SaisieMotifsDossiersVS": true,
                      "PublierDossiersVS": true,
                      "ConsulterMemosEleve": true,
                      "SaisirMemos": true,
                      "avecSaisieDispense": true,
                      "incidents": {
                        "acces": true,
                        "uniquementMesIncidentsSignales": true,
                        "saisie": true,
                        "publier": true
                      },
                      "AvecPublicationPunitions": true,
                      "avecAccesPunitions": true,
                      "avecSaisiePunitions": true,
                      "avecCreerMotifIncidentPunitionSanction": true,
                      "avecRecapPunitions": true,
                      "avecRecapSanctions": true,
                      "avecSaisieAppreciationsGenerales": true,
                      "intendance": {
                        "avecDemandeTravauxIntendance": true,
                        "uniquementMesTravauxIntendance": true,
                        "avecExecutionTravauxIntendance": true,
                        "avecDemandeTachesSecretariat": true,
                        "uniquementMesTachesSecretariat": true,
                        "avecExecutionTachesSecretariat": true,
                        "avecDemandeTachesInformatique": true,
                        "uniquementMesTachesInformatique": true,
                        "avecExecutionTachesInformatique": true
                      },
                      "services": {
                        "avecCreationSousServices": true,
                        "avecModificationCoefGeneral": true
                      },
                      "autoriseAConsulterPhotosDeTousLesEleves": true,
                      "avecDroitDeconnexionMessagerie": true,
                      "avecCreationSujetForum": true,
                      "cours": {
                        "domaineConsultationEDT": {
                          "_T": 8,
                          "V": "[1..45]"
                        },
                        "avecReservationCreneauxLibres": true,
                        "modifierElevesDetachesSurCoursDeplaceCreneauLibre": true,
                        "modifierMatieresCoursEPIEtAP": true,
                        "modifierSalles": true,
                        "modifierMateriels": true,
                        "creerCoursPermanenceFeuilleAppel": true,
                        "deplacerCours": true,
                        "domaineModificationCours": {
                          "_T": 8,
                          "V": "[44..45]"
                        },
                        "avecMateriel": true,
                        "avecFicheCoursConseil": true,
                        "afficherElevesDetachesDansCours": true
                      },
                      "avecSaisieCahierDeTexte": true,
                      "creerCategoriesDeCahierDeTexte": true,
                      "avecSaisiePieceJointeCahierDeTexte": true,
                      "tailleMaxPieceJointeCahierDeTexte": 5120000,
                      "avecSaisieDocumentsCasiers": true,
                      "tailleMaxDocJointEtablissement": 2048000,
                      "tailleMaxRenduTafEleve": 4194304,
                      "consulterDonneesAdministrativesAutresEleves": true,
                      "compte": {
                        "avecInformationsPersonnelles": true,
                        "avecSaisieInfosPersoCoordonnees": true,
                        "avecSaisieInfosPersoAutorisations": true
                      }
                    },
                    "reglesSaisieMDP": {
                      "min": 8,
                      "max": 32,
                      "regles": {
                        "_T": 26,
                        "V": "[4]"
                      }
                    },
                    "avecRessourcesGranulaire": false,
                    "avecRessourcesRenduTAF": false,
                    "avecRessourcesEnvoiNote": false,
                    "activerKiosqueRenduTAF": true,
                    "activerKiosqueEnvoiNote": true,
                    "listeRessourcesRecherche": {},
                    "cloudIndexActif": false,
                    "avecCloudIndex": false,
                    "listeCloud": {
                      "_T": 24,
                      "V": [] // TO UNDERSTAND | TO CONFIG
                    },
                    "autorisationKiosque": true,
                    "autorisationCloud": true,
                    "tabEtablissementsModeleGrille": [],
                    "listeOnglets": [
                      {
                        "G": 7
                      },
                      {
                        "G": 6,
                        "Onglet": [
                          {
                            "G": 207,
                            "Onglet": [
                              {
                                "G": 16
                              },
                              {
                                "G": 162
                              }
                            ]
                          },
                          {
                            "G": 196
                          },
                          {
                            "G": 208,
                            "Onglet": [
                              {
                                "G": 105
                              },
                              {
                                "G": 271
                              },
                              {
                                "G": 77
                              },
                              {
                                "G": 179
                              }
                            ]
                          },
                          {
                            "G": 209,
                            "Onglet": [
                              {
                                "G": 123
                              },
                              {
                                "G": 142
                              }
                            ]
                          },
                          {
                            "G": 220,
                            "Onglet": [
                              {
                                "G": 127
                              },
                              {
                                "G": 143
                              }
                            ]
                          },
                          {
                            "G": 175,
                            "Onglet": [
                              {
                                "G": 176
                              },
                              {
                                "G": 247
                              },
                              {
                                "G": 264
                              }
                            ]
                          },
                          {
                            "G": 49
                          }
                        ]
                      },
                      {
                        "G": 210,
                        "Onglet": [
                          {
                            "G": 214,
                            "Onglet": [
                              {
                                "G": 99
                              },
                              {
                                "G": 177
                              }
                            ]
                          },
                          {
                            "G": 84,
                            "Onglet": [
                              {
                                "G": 85
                              },
                              {
                                "G": 245
                              },
                              {
                                "G": 86
                              },
                              {
                                "G": 96
                              }
                            ]
                          },
                          {
                            "G": 275
                          },
                          {
                            "G": 149,
                            "Onglet": [
                              {
                                "G": 71
                              },
                              {
                                "G": 75
                              },
                              {
                                "G": 150
                              }
                            ]
                          },
                          {
                            "G": 141
                          }
                        ]
                      },
                      {
                        "G": 61,
                        "Onglet": [
                          {
                            "G": 28
                          },
                          {
                            "G": 243,
                            "Onglet": [
                              {
                                "G": 244
                              },
                              {
                                "G": 154
                              }
                            ]
                          },
                          {
                            "G": 17
                          },
                          {
                            "G": 211,
                            "Onglet": [
                              {
                                "G": 89
                              },
                              {
                                "G": 88
                              },
                              {
                                "G": 272
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "G": 3,
                        "Onglet": [
                          {
                            "G": 23
                          },
                          {
                            "G": 12
                          },
                          {
                            "G": 30
                          },
                          {
                            "G": 38,
                            "Onglet": [
                              {
                                "G": 111
                              },
                              {
                                "G": 112
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "G": 4,
                        "Onglet": [
                          {
                            "G": 13
                          },
                          {
                            "G": 225,
                            "Onglet": [
                              {
                                "G": 25
                              },
                              {
                                "G": 246
                              },
                              {
                                "G": 27
                              }
                            ]
                          },
                          {
                            "G": 227
                          },
                          {
                            "G": 180
                          },
                          {
                            "G": 197
                          }
                        ]
                      },
                      {
                        "G": 55,
                        "Onglet": [
                          {
                            "G": 203,
                            "Onglet": [
                              {
                                "G": 199
                              },
                              {
                                "G": 200
                              },
                              {
                                "G": 248
                              }
                            ]
                          },
                          {
                            "G": 204,
                            "Onglet": [
                              {
                                "G": 56
                              },
                              {
                                "G": 65
                              },
                              {
                                "G": 67
                              }
                            ]
                          },
                          {
                            "G": 276,
                            "Onglet": [
                              {
                                "G": 277
                              }
                            ]
                          },
                          {
                            "G": 205,
                            "Onglet": [
                              {
                                "G": 100
                              },
                              {
                                "G": 202
                              },
                              {
                                "G": 278
                              },
                              {
                                "G": 224
                              },
                              {
                                "G": 181
                              }
                            ]
                          },
                          {
                            "G": 223,
                            "Onglet": [
                              {
                                "G": 45
                              },
                              {
                                "G": 216
                              },
                              {
                                "G": 215
                              }
                            ]
                          },
                          {
                            "G": 249
                          },
                          {
                            "G": 206,
                            "Onglet": [
                              {
                                "G": 178
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "G": 39,
                        "Onglet": [
                          {
                            "G": 108,
                            "Onglet": [
                              {
                                "G": 83
                              },
                              {
                                "G": 109
                              },
                              {
                                "G": 110
                              }
                            ]
                          },
                          {
                            "G": 64
                          },
                          {
                            "G": 161
                          },
                          {
                            "G": 262,
                            "Onglet": [
                              {
                                "G": 261
                              },
                              {
                                "G": 260
                              }
                            ]
                          },
                          {
                            "G": 34
                          },
                          {
                            "G": 273
                          },
                          {
                            "G": 44
                          },
                          {
                            "G": 15
                          }
                        ]
                      },
                      {
                        "G": 5,
                        "Onglet": [
                          {
                            "G": 29,
                            "Onglet": [
                              {
                                "G": 155
                              },
                              {
                                "G": 113
                              },
                              {
                                "G": 114
                              }
                            ]
                          },
                          {
                            "G": 78
                          },
                          {
                            "G": 74
                          },
                          {
                            "G": 20
                          },
                          {
                            "G": 192
                          },
                          {
                            "G": 135
                          },
                          {
                            "G": 212,
                            "Onglet": [
                              {
                                "G": 138
                              },
                              {
                                "G": 139
                              },
                              {
                                "G": 140
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "G": 90,
                        "Onglet": [
                          {
                            "G": 92
                          },
                          {
                            "G": 120
                          }
                        ]
                      },
                      {
                        "G": 59,
                        "Onglet": [
                          {
                            "G": 106,
                            "Onglet": [
                              {
                                "G": 60
                              },
                              {
                                "G": 165
                              },
                              {
                                "G": 171
                              }
                            ]
                          },
                          {
                            "G": 129,
                            "Onglet": [
                              {
                                "G": 97
                              },
                              {
                                "G": 163
                              },
                              {
                                "G": 169
                              },
                              {
                                "G": 146
                              }
                            ]
                          },
                          {
                            "G": 147,
                            "Onglet": [
                              {
                                "G": 134
                              },
                              {
                                "G": 167
                              },
                              {
                                "G": 173
                              }
                            ]
                          },
                          {
                            "G": 107,
                            "Onglet": [
                              {
                                "G": 81
                              },
                              {
                                "G": 166
                              },
                              {
                                "G": 172
                              }
                            ]
                          },
                          {
                            "G": 156,
                            "Onglet": [
                              {
                                "G": 157
                              },
                              {
                                "G": 168
                              },
                              {
                                "G": 174
                              }
                            ]
                          },
                          {
                            "G": 93
                          }
                        ]
                      },
                      {
                        "G": 2,
                        "Onglet": [
                          {
                            "G": 102,
                            "Onglet": [
                              {
                                "G": 104
                              }
                            ]
                          },
                          {
                            "G": 8
                          },
                          {
                            "G": 131
                          },
                          {
                            "G": 158
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
                      74,
                      101,
                      114,
                      155,
                      271
                    ],
                    "listeOngletsNotification": [
                      104,
                      131,
                      8
                    ]
                  }
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