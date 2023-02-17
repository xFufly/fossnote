const fs = require('fs');

function is_compatible(user_agent) {
    const regex = /Mozilla\/5.0 \(.+?\) AppleWebKit\/.+? \(KHTML, like Gecko\) Chrome\/.+? Safari\/.+?$/;
    // Vérifiez si l'en-tête User-Agent correspond à un navigateur Chrome
    return regex.test(user_agent);
}

function generate_session_id() {
    // Générer une session ID unique avec la date actuelle en millisecondes
    return Date.now().toString();
}


function get_metadata() {
    const rawdata = fs.readFileSync(`${__dirname}/config/metadata.json`);
    return JSON.parse(rawdata);
}

function getFirstSchoolYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const month = today.getMonth() + 1;
    if (month >= 9) {
        return currentYear;
    } else {
        return currentYear - 1;
    }
}

function getLastSchoolYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const month = today.getMonth() + 1;
    let schoolYear;
    if (month >= 9) {
        return currentYear + 1;
    } else {
        return currentYear;
    }
}

function getLastMondayOfAugust(year) {
    let lastMonday = new Date(year, 7, 31); // 31 août
    while (lastMonday.getDay() !== 1) { // Tant que ce n'est pas un lundi
        lastMonday.setDate(lastMonday.getDate() - 1); // On recule d'un jour
    }
    return lastMonday.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getFirstWeekdayOfSeptember(year) {
    // Créer une date avec le 1er septembre de l'année choisie
    const date = new Date(year, 8, 1);

    // Tant que la date est un samedi ou un dimanche, avancer d'un jour
    while (date.getDay() === 6 || date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    }

    // Retourner la date sous la forme "jj/mm/aaaa"
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearString = date.getFullYear().toString();
    return `${day}/${month}/${yearString}`;
}

function getCurrentSchoolYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const month = today.getMonth() + 1;
    let schoolYear;
    if (month >= 9) {
        // Si on est en septembre ou après, l'année scolaire correspond à l'année en cours et à l'année suivante
        schoolYear = `${currentYear}-${currentYear + 1}`;
    } else {
        // Sinon, l'année scolaire correspond à l'année précédente et à l'année en cours
        schoolYear = `${currentYear - 1}-${currentYear}`;
    }
    return schoolYear;
}

module.exports = {
    is_compatible,
    generate_session_id,
    get_metadata,
    getFirstSchoolYear,
    getLastSchoolYear,
    getLastMondayOfAugust,
    getFirstWeekdayOfSeptember,
    getCurrentSchoolYear
};