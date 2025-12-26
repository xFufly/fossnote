# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Ajouté
- Conformité RGPD complète (banner cookies, droits utilisateurs, politique de confidentialité)
- API pour exercer les droits RGPD (accès, rectification, effacement, portabilité)
- Système de gestion des consentements
- Traçabilité et audit des accès aux données personnelles
- Nettoyage automatique des données périmées
- Headers de sécurité avec Helmet
- Rate limiting pour protéger contre les abus
- Guide de contribution (CONTRIBUTING.md)
- Licence MIT
- Documentation d'installation RGPD

### Modifié
- Structure du projet réorganisée avec dossiers /docs, /scripts, /services

### Sécurité
- Ajout de la protection CSRF (à implémenter)
- Hashage sécurisé des mots de passe avec bcrypt (à implémenter)
- Sessions sécurisées avec express-session

## [0.2.0] - Date à déterminer

### Ajouté
- Espace professeurs : page d'accueil fonctionnelle
- Espace élèves : page d'accueil, données personnelles, notes et devoirs
- Fonction `appelFonction("PageAcceuil")` (en cours)
- Fonction `appelFonction("DernieresNotes")` pour les élèves
- Fonction `appelFonction("PageInfosPerso")` pour les élèves
- Fonction `appelFonction("PageCahierDeTexte")` pour les élèves
- Fonction `appelFonction("SaisiePenseBete")` pour les professeurs
- Fonction `appelFonction("listeClassesGroupes")` pour les professeurs
- Fonction `appelFonction("ListePeriodes")` pour les professeurs
- Fonction `appelFonction("ListeServices")` pour les professeurs

### Modifié
- Amélioration du système de navigation
- Optimisation de la présence

## [0.1.0] - Date à déterminer

### Ajouté
- Page index complète : `/fossnote/`
- Pages espaces avec panels de connexion :
  - Vie scolaire : `/fossnote/viescolaire.html`
  - Parents : `/fossnote/parent.html`
  - Accompagnants : `/fossnote/accompagnant.html`
  - Direction : `/fossnote/direction.html`
  - Professeurs : `/fossnote/professeur.html`
  - Élèves : `/fossnote/eleve.html`
- Système de création de session :
  - Génération d'identifiant de session basé sur le temps
  - Base de données SQLite (`database.db`)
  - Table "sessions"
  - Fonction `appelFonction("FonctionParametres")`
- Système de connexion pour élèves et professeurs :
  - Génération "alea" et "challenge"
  - Stockage de la solution du challenge
  - Fonction `appelFonction("Identification")`
  - Fonction `appelFonction("Authentification")`
  - Fonction `appelFonction("ParametresUtilisateur")`
- Fonction `appelFonction("Navigation")`
- Fonction `appelFonction("Presence")`
- Comptes de démonstration :
  - Élève : `akaty` / `Password123!`
  - Professeur : `pgothier` / `Password123!`

### Sécurité
- Base de données SQLite pour stocker les sessions
- Système de challenge pour l'authentification

## Format des versions

- **[MAJOR]** : Changements incompatibles de l'API
- **[MINOR]** : Ajout de fonctionnalités rétrocompatibles
- **[PATCH]** : Corrections de bugs rétrocompatibles

## Types de changements

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Vulnérabilités corrigées

---

**Note :** Les dates et versions seront mises à jour au fur et à mesure des releases officielles.

[Unreleased]: https://github.com/chblitz62/fossnote/compare/v0.1.0...HEAD
