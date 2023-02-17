const forge = require('node-forge');

const { get_metadata, getCurrentSchoolYear, getFirstSchoolYear, getLastMondayOfAugust, getFirstWeekdayOfSeptember, getLastSchoolYear } = require('../../../../helpers');

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

            encryptAES((currentSession.numeroOrdre + 2).toString(), currentSession.aes.key, currentSession.aes.iv).then((enryptedNumeroOrdre) => {
                const response = {
                    nom: 'FonctionParametres',
                    session: parseInt(session_id),
                    numeroOrdre: enryptedNumeroOrdre,
                    donneesSec: {
                        donnees: {
                            NomEtablissement: metadata.title,
                            NomEtablissementConnexion: metadata.name,
                            PageEtablissement: "pageetablissement.html",
                            Theme: 8,
                            anneeScolaire: getCurrentSchoolYear(),
                            avecMembre: false,
                            avecPagePubliqueEtab: false,
                            espaces: {
                                "_T": 24,
                                "V": [
                                  {
                                    "G": 16,
                                    "L": "Direction",
                                    "url": "direction.html"
                                  },
                                  {
                                    "G": 1,
                                    "L": "Professeurs",
                                    "url": "professeur.html"
                                  },
                                  {
                                    "G": 13,
                                    "L": "Vie scolaire",
                                    "url": "viescolaire.html"
                                  },
                                  {
                                    "G": 2,
                                    "L": "Parents",
                                    "url": "parent.html"
                                  },
                                  {
                                    "G": 25,
                                    "L": "Accompagnants",
                                    "url": "accompagnant.html"
                                  },
                                  {
                                    "G": 3,
                                    "L": "Élèves",
                                    "url": "eleve.html"
                                  }
                                ]
                            },
                            genreImageConnexion: 4,
                            identifiantNav: null,
                            labelLienProduit: "Aller sur le site de Pronote",
                            langID: 1036,
                            langue: "fr",
                            listeLangues: {
                                "_T": 24,
                                "V": [
                                  {
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
                                ]
                            },
                            listePolices: {
                                "_T": 24,
                                "V": [
                                  {
                                    "L": "@Malgun Gothic"
                                  },
                                  {
                                    "L": "@Microsoft JhengHei"
                                  },
                                  {
                                    "L": "@Microsoft JhengHei UI"
                                  },
                                  {
                                    "L": "@Microsoft YaHei"
                                  },
                                  {
                                    "L": "@Microsoft YaHei UI"
                                  },
                                  {
                                    "L": "@NSimSun"
                                  },
                                  {
                                    "L": "@SimSun"
                                  },
                                  {
                                    "L": "@Yu Gothic Medium"
                                  },
                                  {
                                    "L": "@Yu Gothic UI"
                                  },
                                  {
                                    "L": "Arial"
                                  },
                                  {
                                    "L": "Arial Black"
                                  },
                                  {
                                    "L": "Bahnschrift"
                                  },
                                  {
                                    "L": "Bahnschrift Condensed"
                                  },
                                  {
                                    "L": "Bahnschrift Light"
                                  },
                                  {
                                    "L": "Bahnschrift Light Condensed"
                                  },
                                  {
                                    "L": "Bahnschrift Light SemiCondensed"
                                  },
                                  {
                                    "L": "Bahnschrift SemiBold"
                                  },
                                  {
                                    "L": "Bahnschrift SemiBold Condensed"
                                  },
                                  {
                                    "L": "Bahnschrift SemiBold SemiConden"
                                  },
                                  {
                                    "L": "Bahnschrift SemiCondensed"
                                  },
                                  {
                                    "L": "Bahnschrift SemiLight"
                                  },
                                  {
                                    "L": "Bahnschrift SemiLight Condensed"
                                  },
                                  {
                                    "L": "Bahnschrift SemiLight SemiConde"
                                  },
                                  {
                                    "L": "Calibri"
                                  },
                                  {
                                    "L": "Calibri Light"
                                  },
                                  {
                                    "L": "Cambria"
                                  },
                                  {
                                    "L": "Cambria Math"
                                  },
                                  {
                                    "L": "Comic Sans MS"
                                  },
                                  {
                                    "L": "Consolas"
                                  },
                                  {
                                    "L": "Courier"
                                  },
                                  {
                                    "L": "Courier New"
                                  },
                                  {
                                    "L": "Ebrima"
                                  },
                                  {
                                    "L": "Fixedsys"
                                  },
                                  {
                                    "L": "Gadugi"
                                  },
                                  {
                                    "L": "Georgia"
                                  },
                                  {
                                    "L": "Ink Free"
                                  },
                                  {
                                    "L": "Javanese Text"
                                  },
                                  {
                                    "L": "Leelawadee UI"
                                  },
                                  {
                                    "L": "Leelawadee UI Semilight"
                                  },
                                  {
                                    "L": "Lucida Console"
                                  },
                                  {
                                    "L": "Malgun Gothic"
                                  },
                                  {
                                    "L": "Microsoft Himalaya"
                                  },
                                  {
                                    "L": "Microsoft JhengHei"
                                  },
                                  {
                                    "L": "Microsoft JhengHei UI"
                                  },
                                  {
                                    "L": "Microsoft New Tai Lue"
                                  },
                                  {
                                    "L": "Microsoft PhagsPa"
                                  },
                                  {
                                    "L": "Microsoft Tai Le"
                                  },
                                  {
                                    "L": "Microsoft YaHei"
                                  },
                                  {
                                    "L": "Microsoft YaHei UI"
                                  },
                                  {
                                    "L": "Microsoft Yi Baiti"
                                  },
                                  {
                                    "L": "Modern"
                                  },
                                  {
                                    "L": "Mongolian Baiti"
                                  },
                                  {
                                    "L": "MS Sans Serif"
                                  },
                                  {
                                    "L": "MS Serif"
                                  },
                                  {
                                    "L": "MV Boli"
                                  },
                                  {
                                    "L": "Myanmar Text"
                                  },
                                  {
                                    "L": "Nirmala UI"
                                  },
                                  {
                                    "L": "Nirmala UI Semilight"
                                  },
                                  {
                                    "L": "NSimSun"
                                  },
                                  {
                                    "L": "Roman"
                                  },
                                  {
                                    "L": "Script"
                                  },
                                  {
                                    "L": "Segoe MDL2 Assets"
                                  },
                                  {
                                    "L": "Segoe Print"
                                  },
                                  {
                                    "L": "Segoe UI"
                                  },
                                  {
                                    "L": "Segoe UI Black"
                                  },
                                  {
                                    "L": "Segoe UI Emoji"
                                  },
                                  {
                                    "L": "Segoe UI Historic"
                                  },
                                  {
                                    "L": "Segoe UI Light"
                                  },
                                  {
                                    "L": "Segoe UI Semibold"
                                  },
                                  {
                                    "L": "Segoe UI Semilight"
                                  },
                                  {
                                    "L": "Segoe UI Symbol"
                                  },
                                  {
                                    "L": "SimSun"
                                  },
                                  {
                                    "L": "Small Fonts"
                                  },
                                  {
                                    "L": "System"
                                  },
                                  {
                                    "L": "Terminal"
                                  },
                                  {
                                    "L": "Times New Roman"
                                  },
                                  {
                                    "L": "Trebuchet MS"
                                  },
                                  {
                                    "L": "Verdana"
                                  },
                                  {
                                    "L": "Webdings"
                                  },
                                  {
                                    "L": "Wingdings"
                                  },
                                  {
                                    "L": "Yu Gothic Medium"
                                  },
                                  {
                                    "L": "Yu Gothic UI"
                                  }
                                ]
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
                            version: "PRONOTE 2022 - 0.3.0 gestion de vie scolaire, notes, compétences, absences/retards/dispenses, incidents/punitions/sanctions, stages... INDEX ÉDUCATION",
                            versionPN: "2022.0.3.0"
                        },
                        nom: 'FonctionParametres'
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