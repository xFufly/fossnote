# Fossnote

Fossnote est un "serveur PRONOTE" auto-hébergé open source et gratuit compatible avec le client Pronote. (Free Open Source Selfhostable PRONOTE).

## Installation

    $ git clone https://github.com/CaraPloof/fossnote
    $ cd fossnote
    $ npm install
    $ npm start

Ensuite allez sur `localhost:3000/pronote/`.

## Fonctionnalités actuelles (front-end):

- Page index implémentée : `/pronote/` (entièrement implémentée)

- Pages espaces (seulement affichage des panels de connexion):
    - élèves : `/pronote/eleve.html`
    - professeurs : `/pronote/professeur.html`
    - vie scolaire : `/pronote/viescolaire.html`
    - parents : `/pronote/parent.html`
    - accompagnants : `/pronote/accompagnant.html`
    - direction : `/pronote/direction.html`

## Fonctionnalités actuelles (back-end):
- La création de session (entièrement implémentée) :
    - Génération d'un identifiant de session en fonction du temps
    - Génération aléatoire de paramètres RSA (Modulus, Exponent et Private Key Pem)
    - Ajout des informations de session dans une base de données : `session.db` (sqlite3) 
    - `appelfonction("FonctionParametres")` (voir protocoles)

- En cours de développement...

## Protocole Client : 
A venir...

## Protocole Server : 
A venir...
