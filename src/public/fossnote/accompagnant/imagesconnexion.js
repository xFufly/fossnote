IE.fModule({f:function(exports,require,module,global){"use strict";module.exports = function (lObjetImageConnexion) {
var TypeArrierePlanAuthentification = require('TypeArrierePlanAuthentification.js').TypeArrierePlanAuthentification
var ObjetImageConnexion = require('ObjetImageConnexion.js');
if (!ObjetImageConnexion) ObjetImageConnexion = lObjetImageConnexion;

var imagesExtra = {
'10-10':{    
srcImage: 'ressources/harcelement2023.png',
urlImageFond: 'ressources/background-harcelement2023.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false
},

'10-26':{    
srcImage: 'ressources/motsenor.gif',
urlImageFond: 'ressources/motsenor-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: true,
lien: 'https://www.lesmotsenor.org/enseignant/?utm_source=fossnote&amp;amp;utm_medium=referral_partner&amp;amp;utm_campaign=relances_lmeo_2022&amp;amp;utm_content=bannieresite_relanceinscriptionslmeo_fossnote',
texteLien: 'i',
suiviLogo1: 'https://www.index-education.com/swie/tl.php?ln=motsenor1122',
couleurLien: '#ebae1c',
bottomLien: '5%',
leftLien: '22%',
tailleLien: '100%'
},

'10-27':{    
srcImage: 'ressources/motsenor.gif',
urlImageFond: 'ressources/motsenor-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: true,
lien: 'https://www.lesmotsenor.org/enseignant/?utm_source=fossnote&amp;amp;utm_medium=referral_partner&amp;amp;utm_campaign=relances_lmeo_2022&amp;amp;utm_content=bannieresite_relanceinscriptionslmeo_fossnote',
texteLien: 'i',
suiviLogo1: 'https://www.index-education.com/swie/tl.php?ln=motsenor1122',
couleurLien: '#ebae1c',
bottomLien: '5%',
leftLien: '22%',
tailleLien: '100%'
},

'10-28':{    
srcImage: 'ressources/motsenor.gif',
urlImageFond: 'ressources/motsenor-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: true,
lien: 'https://www.lesmotsenor.org/enseignant/?utm_source=fossnote&amp;utm_medium=referral_partner&amp;utm_campaign=relances_lmeo_2022&amp;utm_content=bannieresite_relanceinscriptionslmeo_fossnote',
texteLien: 'i',
suiviLogo1: 'https://www.index-education.com/swie/tl.php?ln=motsenor1122',
couleurLien: '#ebae1c',
bottomLien: '5%',
leftLien: '22%',
tailleLien: '100%'
},

'10-29':{    
srcImage: 'ressources/motsenor.gif',
urlImageFond: 'ressources/motsenor-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: true,
lien: 'https://www.lesmotsenor.org/enseignant/?utm_source=fossnote&amp;amp;utm_medium=referral_partner&amp;amp;utm_campaign=relances_lmeo_2022&amp;amp;utm_content=bannieresite_relanceinscriptionslmeo_fossnote',
texteLien: 'i',
suiviLogo1: 'https://www.index-education.com/swie/tl.php?ln=motsenor1122',
couleurLien: '#ebae1c',
bottomLien: '5%',
leftLien: '22%',
tailleLien: '100%'
}

};
ObjetImageConnexion.setDefinitionImagesExtra(imagesExtra);

var lImages = [];

lImages[TypeArrierePlanAuthentification.Louvre] =[{

srcImage: 'ressources/porte.gif',
urlImageSuite: 'ressources/porte-suite.jpg',
urlImageFond: 'ressources/porte-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100932719',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_8_porte',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/porte.gif',
urlImageSuite: 'ressources/porte-suite.jpg',
urlImageFond: 'ressources/porte-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100932719',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_8_porte',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/chienchinois.gif',
urlImageSuite: 'ressources/chienchinois-suite.jpg',
urlImageFond: 'ressources/chienchinois-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100932719',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_8_porte',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/chienchinois.gif',
urlImageSuite: 'ressources/chienchinois-suite.jpg',
urlImageFond: 'ressources/chienchinois-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100932719',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_8_porte',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/caricature.gif',
urlImageSuite: 'ressources/caricature-suite.jpg',
urlImageFond: 'ressources/caricature-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Voir le jeu',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00JEU00101jeuerrhiver01',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_10_caricature',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/caricature.gif',
urlImageSuite: 'ressources/caricature-suite.jpg',
urlImageFond: 'ressources/caricature-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Voir le jeu',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00JEU00101jeuerrhiver01',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_10_caricature',
dateMaxLien: new Date(1705147042000)
}, {

    srcImage: 'ressources/holtum.gif',
    urlImageSuite: 'ressources/holtum-suite.jpg',
    urlImageFond: 'ressources/holtum-background.png',
    widthImageSuite: 1442,
    heightImageSuite: 600,
    couleurConnexion: '#ffffff',
    classImageFond: 'Repeat',
    lienLogo: 'https://numelyo.bm-lyon.fr/',
    styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
    suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
    avecLienSuite: true,
    texteLienSuite: '> Accéder à ce document',
    lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_02AFF01000AffM0039',
    suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_11_holtum',
    dateMaxLien: new Date(1705147042000)
}, {

    srcImage: 'ressources/holtum.gif',
    urlImageSuite: 'ressources/holtum-suite.jpg',
    urlImageFond: 'ressources/holtum-background.png',
    widthImageSuite: 1442,
    heightImageSuite: 600,
    couleurConnexion: '#ffffff',
    classImageFond: 'Repeat',
    lienLogo: 'https://numelyo.bm-lyon.fr/',
    styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
    suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
    avecLienSuite: true,
    texteLienSuite: '> Accéder à ce document',
    lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_02AFF01000AffM0039',
    suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_11_holtum',
    dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/neutre.png',
urlImageFond: 'ressources/neutre-bkg.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/summer.gif',
urlImageFond: 'ressources/summer-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/summer.gif',
urlImageFond: 'ressources/summer-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/summer.gif',
urlImageFond: 'ressources/summer-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/summer.gif',
urlImageFond: 'ressources/summer-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/summer.gif',
urlImageFond: 'ressources/summer-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/summer.gif',
urlImageFond: 'ressources/summer-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/rentree2022.jpg',
urlImageFond: 'ressources/rentree2022-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/rentree2022.jpg',
urlImageFond: 'ressources/rentree2022-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/rentree2022.jpg',
urlImageFond: 'ressources/rentree2022-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/rentree2022.jpg',
urlImageFond: 'ressources/rentree2022-background.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}, {

srcImage: 'ressources/modernart.gif',
urlImageSuite: 'ressources/modernart-suite.jpg',
urlImageFond: 'ressources/modernart-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_02AFF01000AffP0091',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_1_modernart',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/modernart.gif',
urlImageSuite: 'ressources/modernart-suite.jpg',
urlImageFond: 'ressources/modernart-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_02AFF01000AffP0091',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_1_modernart',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/tondeur.gif',
urlImageSuite: 'ressources/tondeur-suite.jpg',
urlImageFond: 'ressources/tondeur-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100621577/IMG00000105',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_2_tondeur',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/tondeur.gif',
urlImageSuite: 'ressources/tondeur-suite.jpg',
urlImageFond: 'ressources/tondeur-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100621577/IMG00000105',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_2_tondeur',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/chapeau.gif',
urlImageSuite: 'ressources/chapeau-suite.jpg',
urlImageFond: 'ressources/chapeau-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_02AFF010010AffG0181',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_3_chapeau',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/chapeau.gif',
urlImageSuite: 'ressources/chapeau-suite.jpg',
urlImageFond: 'ressources/chapeau-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_02AFF010010AffG0181',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_3_chapeau',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/kitha.gif',
urlImageSuite: 'ressources/kitha-suite.jpg',
urlImageFond: 'ressources/kitha-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001104503334&amp;amp;amp;amp;#039;',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_4_kitha',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/kitha.gif',
urlImageSuite: 'ressources/kitha-suite.jpg',
urlImageFond: 'ressources/kitha-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001104503334&amp;amp;amp;amp;amp;#039;',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_4_kitha',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/lettres.gif',
urlImageSuite: 'ressources/lettres-suite.jpg',
urlImageFond: 'ressources/lettres-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100965982/IMG00000058',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_5_lettres',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/lettres.gif',
urlImageSuite: 'ressources/lettres-suite.jpg',
urlImageFond: 'ressources/lettres-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100965982/IMG00000058',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_5_lettres',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/naturalis.gif',
urlImageSuite: 'ressources/naturalis-suite.jpg',
urlImageFond: 'ressources/naturalis-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001102510737',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_6_naturalis',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/naturalis.gif',
urlImageSuite: 'ressources/naturalis-suite.jpg',
urlImageFond: 'ressources/naturalis-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001102510737',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_6_naturalis',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/chamonix.gif',
urlImageSuite: 'ressources/chamonix-suite.jpg',
urlImageFond: 'ressources/chamonix-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00JEU00101jeumemvacancesdhiver',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_7_chamonix',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/chamonix.gif',
urlImageSuite: 'ressources/chamonix-suite.jpg',
urlImageFond: 'ressources/chamonix-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00JEU00101jeumemvacancesdhiver',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_7_chamonix',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/porte.gif',
urlImageSuite: 'ressources/porte-suite.jpg',
urlImageFond: 'ressources/porte-background.png',
widthImageSuite: 1442,
heightImageSuite: 600,
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
lienLogo: 'https://numelyo.bm-lyon.fr/',
styleLogo: 'background-image: url(ressources/logo-numelyo.png);width: 166px;height: 47px;',
suiviLogo: 'https://www.index-education.com/swie/tl.php?ln=lyon_logo',
avecLienSuite: true,
texteLienSuite: '> Accéder à ce document',
lienSuite: 'https://numelyo.bm-lyon.fr/f_view/BML:BML_00GOO0100137001100932719',
suiviLienSuite: 'https://www.index-education.com/swie/tl.php?ln=lyon22_8_porte',
dateMaxLien: new Date(1705147042000)
}, {

srcImage: 'ressources/sql-join-infographie.png',
urlImageFond: 'ressources/sql-join-infographie.png',
couleurConnexion: '#ffffff',
classImageFond: 'Repeat',
avecLien: false,
avecLienSuite: false
}];



ObjetImageConnexion.setDefinitionImages(lImages);
}
},fn:"imagesconnexion.js"});