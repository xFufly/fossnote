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
    - professeurs : `/pronote/professeur.html`
    - vie scolaire : `/pronote/viescolaire.html`
    - parents : `/pronote/parent.html`
    - accompagnants : `/pronote/accompagnant.html`
    - direction : `/pronote/direction.html`
    
- Pages espaces (panels connexion + panels acceuil) :
    - élèves : `/pronote/eleve.html`

## Fonctionnalités actuelles (back-end):
- La création de session (entièrement implémentée) :
    - Génération d'un identifiant de session en fonction du temps
    - Génération aléatoire de paramètres RSA (Modulus, Exponent et Private Key Pem)
    - Ajout des informations de session dans une base de données : `database.db` (table: "sessions") (sqlite3) 
    - `appelfonction("FonctionParametres")` (voir protocoles)

- Connexion (pour espace élèves seulement) :
    - Génération "alea" et "challenge" (voir protocoles)
    - Stockage de la solution du challenge pour l'Authentification
    - `appelFonction("Identification")` (voir protocoles)
    - `appelFonction("Authentification")` (voir protocoles)
    - `appelFonction("ParametresUtilisateur")` (voir protocoles)
    
- Navigation : `appelFonction("Navigation")` (voir protocoles)

- Presence : `appelFonction("Presence")` (voir protocoles)

- PageAcceuil (pour espace élèves seulement) : `appelFonction("PageAcceuil")` (en cours de développement) (voir protocoles)

- DernieresNotes (pour espace élèves seulement) : `appelFonction("DernieresNotes")` (en cours de développement) (voir protocoles)

- TODO : DB Sync (notes, EDT, ...)

## Identifiants exemples (création automatique au démarrage du serveur):
- Espace élèves : Identifiant: `akaty` Mot de passe : `Password123!`

## Protocole Client : 
A venir...

## Protocole Server : 
A venir...
