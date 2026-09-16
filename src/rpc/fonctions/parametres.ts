import metadata from "../../../config/metadata.json";
import acquisitionsData from "../../../config/constants/acquisitions.json";
import holidaysData from "../../../config/constants/holidays.json";
import timeSlotsData from "../../../config/constants/timeSlots.json";

import {
    generateListeComboPeriodes,
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
    const httpServerDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    let avecChoixConnexion: boolean = false;
    let avecRecuperationInfosConnexion: boolean = false;

    let namespace: string = "Espace ";

    switch (ctx.espaceId) {
        case 16:
            namespace += "Direction";
            break;
        case 3:
            namespace += "Élèves";
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

    const { Periodes } = metadata;
    const listePeriodes = [];

    for (const [key, value] of Object.entries(Periodes)) {
        const L: string = value.name;
        const N: string = "0001";
        const G: number = 1;
        const periodeNotation: number = parseInt(key.slice(1), 10) - 1;
        const dateDebut = {
            _T: 7,
            V: value.from,
        };
        const dateFin = {
            _T: 7,
            V: value.to,
        };

        listePeriodes.push({
            L,
            N,
            G,
            periodeNotation,
            dateDebut,
            dateFin,
        });
    }

    return {
        Nom: namespace,
        AvecEspaceMobile: false,
        URLMobile: `mobile.${ctx.espaceId}.html`,
        Theme: baseInfo.Theme ?? 8,
        PageEtablissement: baseInfo.PageEtablissement ?? "pageetablissement.html",
        anneeScolaire: getCurrentSchoolYear(),
        avecMembre: false,
        avecPagePubliqueEtab: false,
        genreImageConnexion: baseInfo.genreImageConnexion ?? 4,
        labelLienProduit: baseInfo.labelLienProduit ?? "Aller sur le site de Pronote",
        listePolices: baseInfo.listePolices,
        logoProduitCss: baseInfo.logoProduitCss ?? "Image_Logo_PronoteBarreHaut",
        mentionsPagesPubliques: baseInfo.mentionsPagesPubliques ?? {
            lien: {
                _T: 21,
                V: "",
            },
        },
        pourNouvelleCaledonie: false,
        urlConfidentialite: {
            V: "",
            _T: 23,
        },
        urlImageConnexion: baseInfo.urlImageConnexion ?? "",
        DateServeurHttp: {
            V: httpServerDate,
            _T: 7,
        },
        General: {
            AnneeScolaire: getCurrentSchoolYear(),
            Police: "arial,helvetica,sans-serif",
            PremiereHeure: {
                V: "30/12/1899 8:10:00",
            },
            TaillePolice: 11,
            avecForum: true,
            urlAccesVideos: {
                _T: 23,
                V: "",
            },

            ActivationMessagerieEntreParents: false,
            AfficherAbbreviationNiveauDAcquisition: false,
            AvecAffichageDecalagePublicationEvalsAuxParents: true,
            AvecAffichageDecalagePublicationNotesAuxParents: true,
            AvecChoixConnexion: avecChoixConnexion,
            AvecElevesRattaches: false,
            AvecEvaluationHistorique: false,
            AvecGestionNiveauxCECRL: false,
            AvecHeuresPleinesApresMidi: true,
            AvecRecuperationInfosConnexion: avecRecuperationInfosConnexion,
            BaremeMaxDevoirs: {
                V: "999",
                _T: 10,
            },
            BaremeNotation: {
                V: "20",
                _T: 10,
            },
            Collectivite: {
                L: "Collectivite",
                genreCollectivite: 0
            },
            DemiJourneesOuvrees: [
                {
                    V: "[0..5]",
                    _T: 26,
                },
                {
                    V: "[0,1,3..5]",
                    _T: 26,
                },
            ],
            DerniereDate: listePeriodes[listePeriodes.length - 1]!.dateFin,
            DomainesFrequences: [
                {
                    _T: 8,
                    V: "[1..52]"
                },
                {
                    _T: 8,
                    V: "[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51]"
                },
                {
                    _T: 8,
                    V: "[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52]"
                }
            ],
            DureeSequence: 0.0416666666666667,
            GestionParcoursExcellence: true,
            JourOuvre: {
                V: getDateToday().split(" ")[0],
                _T: 7,
            },
            JoursDemiPension: {
                V: "[0..4]",
                _T: 26,
            },
            JoursOuvres: {
                V: "[1..5]",
                _T: 11,
            },
            LibellesFrequences: [
                "",
                "Q1",
                "Q2",
                "",
            ],
            ListeHeures: {
                V: timeSlotsData.debut,
                _T: 24,
            },
            ListeHeuresFin: {
                V: timeSlotsData.fin,
                _T: 24,
            },
            ListeHeuresFinPourVS: {
                V: timeSlotsData.fin.map(({ A, ...item }) => item),
                _T: 24,
            },
            ListeNiveauxDAcquisitions: {
                V: acquisitionsData,
                _T: 24,
            },
            ListePeriodes: listePeriodes,
            NbJDecalageDatePublicationParDefaut: 0,
            NbJDecalagePublicationAuxParents: 0,
            NeComptabiliserQueEvalsAnneeScoDsValidAuto: false,
            NomEtablissement: baseInfo.NomEtablissement ?? "SITE DE DEMONSTRATION - FOSSNOTE",
            NomEtablissementConnexion: baseInfo.NomEtablissementConnexion ?? "SITE DE DEMONSTRATION",
            PlaceDemiJourneeAbsence: 10,
            PlacesParHeure: 2,
            PlacesParJour: 20,
            PondererMatieresSelonLeurCoeffDsDomaine: false,
            PremierLundi: {
                V: getLastMondayOfAugust(getFirstSchoolYear()),
                _T: 7,
            },
            PremiereDate: {
                V: getFirstWeekdayOfSeptember(getFirstSchoolYear()),
                _T: 7,
            },

            SansValidationNivIntermediairesDsValidAuto: false,
            TailleMaxAppreciation: [
                255,
                255,
                255,
                255,
                255,
                255,
                255,
                255,
                255,
                255,
                255
            ],
            
            UrlAide: {
                _T: 23,
                V: "https://doc.index-education.com/index.php?p=FR&lg=fr&l=pn&m=2022&e=16&c=%s&cl=%s",
            },
            accessibiliteNonConforme: false,
            activationDemiPension: false,
            activerBlog: true,
            afficherSequences: false,
            aideContextuelle: {
                7: 11,
                8: 14,
                9: 1,
                12: 7,
                13: 18,
                15: 1,
                16: 8,
                17: 4,
                20: 4,
                23: 18,
                25: 12,
                27: 1,
                28: 12,
                34: 1,
                42: 6,
                45: 5,
                49: 16,
                56: 14,
                60: 1,
                65: 10,
                71: 4,
                75: 3,
                77: 3,
                78: 4,
                81: 3,
                85: 23,
                86: 9,
                88: 4,
                89: 1,
                92: 5,
                93: 2,
                99: 6,
                100: 4,
                101: 2,
                104: 7,
                105: 5,
                110: 1,
                113: 15,
                120: 2,
                131: 13,
                135: 1,
                138: 2,
                139: 2,
                140: 3,
                141: 1,
                150: 2,
                154: 3,
                157: 3,
                158: 5,
                163: 1,
                165: 1,
                166: 4,
                167: 1,
                168: 4,
                172: 3,
                174: 3,
                177: 5,
                180: 1,
                192: 3,
                196: 3,
                199: 1,
                200: 1,
                202: 1,
                215: 1,
                224: 1,
                244: 2,
                245: 7,
                246: 6,
                248: 1,
                249: 1,
                260: 1,
                261: 1,
                272: 4,
                277: 1,
                278: 3,
                url_accueil: "https://docs.index-education.com/docs_fr/fr-support-pronote-enseignants-pointnet.php"
            },
            couleurActiviteLangagiere: "#800000",
            dateDebutPremierCycle: {
                V: getLastMondayOfAugust(getFirstSchoolYear()),
                _T: 7,
            },
            debutDemiPension: 6,
            estHebergeEnFrance: true,
            finDemiPension: 12,
            genresRenduTAFValable: {
                V: "[0..4]",
                _T: 26,
            },
            grillesEDTEnCycle: 0,
            heurePublicationObservationEspaceParents: {
                _T: 7,
                V: "30/12/1899 18:00:00"
            },
            joursOuvresParCycle: 5,
            langID: 1036,
            langue: "fr",
            listeAnneesPrecedentes: {
                V: [],
                _T: 24,
            },
            listeAnnotationsAutorisees: {
                V: "[1..7]",
                _T: 26,
            },
            listeComboPeriodes: generateListeComboPeriodes(metadata),
            listeJoursFeries: {
                V: holidaysData,
                _T: 24,
            },
            listeLangues: baseInfo.listeLangues,
            maskTelephone: "!99 99 99 99 99 99;0;–",
            maxBaremeQuestionQCM: 20,
            maxECTS: 10000,
            maxNbPointQCM: 999,
            maxNiveauQCM: 3,
            millesime: baseInfo.millesime ?? "2026",
            minBaremeQuestionQCM: 1,
            nomCookieAppli: "validationAppliMobile",
            nomProduit: "FOSSNOTE",
            numeroPremiereSemaine: 1,
            premierJourSemaine: 2,
            publicationSuiviStage: false,
            publierMentions: true,
            recreations: {
                _T: 24,
                V: [
                    {
                        L: "Récréation du matin",
                        place: 4,
                    },
                    {
                        L: "Récréation de l'après-midi",
                        place: 14,
                    },
                ],
            },
            saisirAbsencesParDJ: 0,
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
                "10",
            ],
            setOfJoursCycleOuvre: {
                _T: 26,
                V: "[0..4]",
            },
            tailleCommentaireDevoir: 40,
            tailleCommentaireUrlCours: 255,
            tailleLibelleElementGrilleCompetence: 500,
            tailleLibelleUrlCours: 60,
            tailleMaxEnregistrementAudioRenduTAF: 3,
            urlAccesTwitter: {
                _T: 23,
                V: "",
            },
            urlCanope: {
                _T: 23,
                V: "",
            },
            urlDeclarationAccessibilite: `accessibilite.html?espace=${ctx.espaceId}`,
            urlFAQEnregistrementDoubleAuth: {
                _T: 23,
                V: `https://www.index-education.com/redirect.php?produit=pn&page=DoubleAuthentification&version=2022.0.3.0&distrib=FR&lg=fr&flag=${namespace.replace(/\s+/g, "_")}`,
            },
            urlLogo: baseInfo.urlLogo,
            urlSiteIndexEducation: {
                _T: 23,
                V: `https://www.index-education.com/redirect.php?produit=pn&page=LogoPronote&version=2022.0.3.0&distrib=FR&lg=fr&flag=${namespace.replace(/\s+/g, "_")}`,
            },
            urlSiteInfosHebergement: {
                _T: 23,
                V: `https://swie.index-education.com/redirect.php?produit=pn&page=InfosHeb&version=2026.2.6.0&distrib=FR&lg=fr&flag=${namespace.replace(/\s+/g, "_")}`,
            },
            urlTutoEnregistrerAppareils: {
                _T: 23,
                V: `https://swie.index-education.com/redirect.php?produit=pn&page=EnregistrerAppareils&version=2026.2.6.0&distrib=FR&lg=fr&flag=${namespace.replace(/\s+/g, "_")}&type=LienDocProduit`,
            },
            urlTutoVideoSecurite: {
                _T: 23,
                V: `https://swie.index-education.com/redirect.php?produit=pn&page=securiser_son_compte&version=2026.2.6.0&distrib=FR&lg=fr&flag=${namespace.replace(/\s+/g, "_")}&type=LienDocProduit`
            },
            valeurDefautPresenceDispense: false,
            version: baseInfo.version ?? "2026.2.6 gestion de vie scolaire, notes, compétences, absences/retards/dispenses, incidents/punitions/sanctions, stages...",
            versionPN: baseInfo.versionPN ?? "2026.2.6",
        },
    };
};