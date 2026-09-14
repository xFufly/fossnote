import metadata from "../../../config/metadata.json";
import acquisitionsData from "../../../config/constants/acquisitions.json";
import fontsData from "../../../config/constants/fonts.json";
import holidaysData from "../../../config/constants/holidays.json";
import timeSlotsData from "../../../config/constants/timeSlots.json";

import { PronoteCrypto } from "../../crypto/cipher";

import {
	getDateToday,
	getCurrentSchoolYear,
	getFirstSchoolYear,
	getLastMondayOfAugust,
	getFirstWeekdayOfSeptember,
} from "../../helpers/date";
import { handleParametresHome } from "./parametresHome";

export const handleParametres = async (body: any, ctx: any) => {
    const baseInfo = await handleParametresHome(body, ctx);
    if (ctx.espaceId === 0) return baseInfo;

    const date = new Date();
    const httpServerDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;


    let avecChoixConnexion: boolean = false;
    let avecRecuperationInfosConnexion: boolean = false;

    let namespace: string = "Espace ";

    switch (ctx.espaceId) {
        case 16:
            namespace += "Direction";
            break;
        case 3:
            namespace += "Elèves";
            avecRecuperationInfosConnexion = true;
            break;
        case 1:
            namespace += "Professeurs";
            baseInfo.Theme = 6;
            avecChoixConnexion = true;
            break;
        case 13:
            namespace += "Vie scolaire";
            break;
        case 2:
            namespace += "Parents";
            avecRecuperationInfosConnexion = true;
            break;
        case 25:
            namespace += "Accompagnants";
            break;
        default:
            namespace += "Inconnu";
            break;
    }

    let { Periodes } = metadata;
    const listePeriodes = [];

    for (const [key, value] of Object.entries(Periodes)) {
        const L: string = value.name;
        const N: string = "0001";
        const G: number = 1;
        const periodeNotation: number = parseInt(key.slice(1)) - 1;
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

    return {
        ...baseInfo,
        AvecEspaceMobile: false, // TODO: Implement mobile space support
        Nom: namespace,
        URLMobile: "mobile.html",
        DateServerHttp: {
            V: httpServerDate,
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
            DerniereDate: listePeriodes[listePeriodes.length - 1]!.dateFin,
            DomainesFrequences: [
                {
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
            DureeSequence: 0.0416666666666667,
            GestionParcoursExcellence: true,
            JourOuvre: {
                V: getDateToday(), // TODO : Day after holliday or today if not holiday
                _T: 7
            },
            JoursDemiPension: {
                V: "[0..4]",
                _T: 26
            },
            JoursOuvres: {
                V: "[0..5]",
                _T: 11
            },
            LibellesFrequences: [
                "",
                "Q1",
                "Q2",
                ""
            ],
            ListeHeures: {
                V: timeSlotsData.debut
            },
            ListeHeuresFin: {
                V: timeSlotsData.fin,
                _T: 24
            },
            ListeNiveauxDAcquisitions: {
                V: acquisitionsData,
                _T: 24
            }
        },
        ListePeriodes: listePeriodes,
        NbJDecalageDatePublicationParDefaut: 0,
        NbJDecalagePublicationAuxParents: 0,
        NeComptabiliserQueEvalsAnneeScoDsValidAuto: false,
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
        listeAnnotationsAutorisees: {
            V: "[1..5]",
            _T: 26
        },
        listeJoursFeries: {
            V: holidaysData,
            _T: 24
        },
        maskTelephone: "!99 99 99 99 99 99;0;–",
        maxBaremeQuestionQCM: 20,
        maxECTS: 10000,
        maxNbPointQCM: 100,
        maxNiveauQCM: 3,
        minBaremeQuestionQCM: 1,
        nomCookieAppli: "validationAppliMobile",
        numeroPremiereSemaine: 1,
        premierJourSemaine: 2,
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
    }

};