import metadata from "../../../config/metadata.json";
import acquisitionsData from "../../../config/constants/acquisitions.json";
import fontsData from "../../../config/constants/fonts.json";
import holidaysData from "../../../config/constants/holidays.json";
import timeSlotsData from "../../../config/constants/timeSlots.json";
import spaces from "../../../config/constants/spaces.json";
import languages from "../../../config/constants/languages.json";

import {
	getDateToday,
	getCurrentSchoolYear,
	getFirstSchoolYear,
	getLastMondayOfAugust,
	getFirstWeekdayOfSeptember,
} from "../../helpers/date";

export const handleParametresHome = async (body: any, ctx: any) => {    
    return {
        NomEtablissement: metadata.title,
        NomEtablissementConnexion: metadata.name,
        PageEtablissement: "pageetablissement.html",
        Theme: 8,
        anneeScolaire: getCurrentSchoolYear(),
        avecMembre: false,
        avecPagePubliqueEtab: false,
        espaces: {
            _T: 24,
            V: spaces
        },
        genreImageConnexion: 4,
        identifiantNav: null,
        labelLienProduit: "Aller sur le site de Pronote",
        langID: 1036,
        langue: "fr",
        listeLangues: {
            _T: 24,
            V: languages
        },
        listePolices: {
            _T: 24,
            V: fontsData
        },
        logoProduitCss: "Image_Logo_PronoteBarreHaut",
        mentionsPagesPubliques: {
            "lien": {
                "_T": 21,
                "V": ""
            }
        },
        millesime: getFirstSchoolYear(),
        pourNouvelleCaledonie: false,
        publierMentions: true,
        urlImageConnexion: "",
        urlLogo: {
            "_T": 23,
            "V": "fichierurlpublique/logo.png?param=AAB670BD59635CFD73D83534927CA89D53FA7E7F513FB7D2ACDDB0BFB1BC2135ED47F6679AFF5E6C06D1E62BB5C9804B7674EC2BED89E4789B3D43A7BD5E0B27B6D5BE5BA0B9696BA63BCE9EAD09B5D5"
        },
        urlSiteIndexEducation: {
            "_T": 23,
            "V": "https://www.index-education.com/redirect.php?produit=pn&page=LogoPronote&version=2022.0.3.0&distrib=FR&lg=fr&flag=Espace_Commun"
        },
        urlSiteInfosHebergement: {
            "_T": 23,
            "V": "https://www.index-education.com/redirect.php?produit=pn&page=InfosHeb&version=2022.0.3.0&distrib=FR&lg=fr&flag=Espace_Commun"
        },
        version: "FOSSNOTE 2022 - 0.3.0 gestion de vie scolaire, notes, compétences, absences/retards/dispenses, incidents/punitions/sanctions, stages... INDEX ÉDUCATION",
        versionPN: "2022.0.3.0"
    }
};