const express = require('express');
const app = express();

const session = require("./databases/session");
const eleves = require("./databases/eleves");
const teachers = require("./databases/teachers");
const homeworks = require("./databases/homeworks");
const classes = require("./databases/classes");
const subjects = require("./databases/subjects");
const evaluations = require("./databases/evaluations");

if (require('./config/discord.json').token) {
    const bot = require("./discord/deploy-commands");
}

app.use(express.json())

// Définit le dossier public
app.use(express.static(`${__dirname}/public`));

// Importer les routes
const homeRoute = require('./routes/fossnote/home');
const directionRoute = require('./routes/fossnote/direction');
const professeurRoute = require('./routes/fossnote/professeur');
const viescolaireRoute = require('./routes/fossnote/viescolaire');
const parentRoute = require('./routes/fossnote/parent');
const accompagnantRoute = require('./routes/fossnote/accompagnant');
const eleveRoute = require('./routes/fossnote/eleve');
const entrepriseRoute = require('./routes/fossnote/entreprise');
const academieRoute = require('./routes/fossnote/academie');
const inscriptionRoute = require('./routes/fossnote/inscription');

// Définir les routes
app.use('/fossnote/', homeRoute);
app.use('/fossnote/direction.html', directionRoute);
app.use('/fossnote/professeur.html', professeurRoute);
app.use('/fossnote/viescolaire.html', viescolaireRoute);
app.use('/fossnote/parent.html', parentRoute);
app.use('/fossnote/accompagnant.html', accompagnantRoute);
app.use('/fossnote/eleve.html', eleveRoute);
//app.use('/fossnote/entreprise.html', entrepriseRoute); TODO
//app.use('/fossnote/academie.html', academieRoute); TODO
//app.use('/fossnote/inscription.html', inscriptionRoute); TODO

// Importer les routes de l'api
const appelDeConnexionRoute = require('./routes/fossnote/api/appeldeconnexion');
const appelFonctionRoute = require('./routes/fossnote/api/appelfonction');

// Définir les routes de l'api
app.use('/fossnote/appeldeconnexion', appelDeConnexionRoute);
app.use('/fossnote/appelfonction', appelFonctionRoute);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});