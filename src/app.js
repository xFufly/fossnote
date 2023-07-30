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
const homeRoute = require('./routes/pronote/home');
const directionRoute = require('./routes/pronote/direction');
const professeurRoute = require('./routes/pronote/professeur');
const viescolaireRoute = require('./routes/pronote/viescolaire');
const parentRoute = require('./routes/pronote/parent');
const accompagnantRoute = require('./routes/pronote/accompagnant');
const eleveRoute = require('./routes/pronote/eleve');
const entrepriseRoute = require('./routes/pronote/entreprise');
const academieRoute = require('./routes/pronote/academie');
const inscriptionRoute = require('./routes/pronote/inscription');

// Définir les routes
app.use('/pronote/', homeRoute);
app.use('/pronote/direction.html', directionRoute);
app.use('/pronote/professeur.html', professeurRoute);
app.use('/pronote/viescolaire.html', viescolaireRoute);
app.use('/pronote/parent.html', parentRoute);
app.use('/pronote/accompagnant.html', accompagnantRoute);
app.use('/pronote/eleve.html', eleveRoute);
//app.use('/pronote/entreprise.html', entrepriseRoute); TODO
//app.use('/pronote/academie.html', academieRoute); TODO
//app.use('/pronote/inscription.html', inscriptionRoute); TODO

// Importer les routes de l'api
const appelDeConnexionRoute = require('./routes/pronote/api/appeldeconnexion');
const appelFonctionRoute = require('./routes/pronote/api/appelfonction');

// Définir les routes de l'api
app.use('/pronote/appeldeconnexion', appelDeConnexionRoute);
app.use('/pronote/appelfonction', appelFonctionRoute);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});