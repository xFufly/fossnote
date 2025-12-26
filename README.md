# Fossnote

<div align="center">

![Fossnote Logo](https://via.placeholder.com/200x200?text=Fossnote)

**Un serveur PRONOTE auto-hébergé, open source et gratuit**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/chblitz62/fossnote)](https://github.com/chblitz62/fossnote/issues)
[![GitHub stars](https://img.shields.io/github/stars/chblitz62/fossnote)](https://github.com/chblitz62/fossnote/stargazers)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![RGPD Compliant](https://img.shields.io/badge/RGPD-Compliant-green)](docs/GUIDE_INSTALLATION_RGPD.md)

[Démo](#) · [Documentation](#documentation) · [Signaler un bug](https://github.com/chblitz62/fossnote/issues) · [Demander une fonctionnalité](https://github.com/chblitz62/fossnote/issues)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Conformité RGPD](#-conformité-rgpd)
- [Documentation](#-documentation)
- [Contribuer](#-contribuer)
- [Sécurité](#-sécurité)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Crédits](#-crédits)

---

## 🎯 À propos

Fossnote est une alternative **libre, open source et auto-hébergée** à PRONOTE. Compatible avec le client web PRONOTE existant, Fossnote permet aux établissements scolaires de reprendre le contrôle de leurs données tout en bénéficiant d'une solution performante et conforme au RGPD.

### Pourquoi Fossnote ?

- 🆓 **100% Gratuit** - Aucun coût de licence
- 🔓 **Open Source** - Code source ouvert et auditable
- 🏠 **Auto-hébergé** - Vos données restent chez vous
- 🔒 **Conforme RGPD** - Respect total de la vie privée
- 🌍 **Compatible** - Fonctionne avec le client PRONOTE existant
- 🚀 **Moderne** - Technologies web actuelles et performantes

---

## ✨ Fonctionnalités

### ✅ Actuellement implémentées

#### Interface utilisateur
- 📱 Page d'accueil responsive et moderne
- 👥 Espaces dédiés pour chaque type d'utilisateur :
  - 👨‍🎓 Élèves
  - 👨‍🏫 Professeurs
  - 👨‍👩‍👧‍👦 Parents
  - 🏫 Vie scolaire
  - 🎯 Direction
  - 🤝 Accompagnants

#### Espace Élèves
- 📊 Consultation des notes
- 📚 Cahier de texte et devoirs
- 👤 Données personnelles
- 📈 Tableau de bord personnalisé

#### Espace Professeurs
- 📝 Saisie de notes (en cours)
- 📋 Gestion des classes et groupes
- 📅 Périodes scolaires
- 📖 Liste des services
- 💭 Pense-bête

#### Backend
- 🔐 Système d'authentification sécurisé
- 💾 Base de données SQLite
- 🔄 Gestion des sessions
- 🌐 API RESTful
- 📡 Protocoles PRONOTE compatibles

#### Conformité & Sécurité
- 🍪 Banner de consentement aux cookies (CNIL)
- 🔒 Politique de confidentialité complète
- 📜 Mentions légales
- ⚖️ API droits RGPD (accès, rectification, effacement, portabilité)
- 🛡️ Headers de sécurité (Helmet)
- 🚦 Rate limiting
- 📝 Traçabilité des accès aux données

### 🚧 En développement

- 📊 Saisie complète des notes par les professeurs
- 📧 Système de messagerie interne
- 📅 Emploi du temps dynamique
- 📈 Bulletins et relevés de notes
- 📤 Export PDF des documents
- 🔔 Notifications en temps réel
- 📱 Application mobile (PWA)

---

## 🚀 Installation

### Prérequis

- **Node.js** v14.0.0 ou supérieur
- **npm** v6.0.0 ou supérieur
- **SQLite3** (inclus avec Node.js)

### Installation rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/chblitz62/fossnote.git
cd fossnote

# 2. Installer les dépendances
npm install

# 3. Copier et configurer l'environnement
cp .env.example .env
# Éditez .env avec vos paramètres

# 4. Initialiser la base de données
npm run db:setup

# 5. Démarrer le serveur
npm start
```

Le serveur démarre sur **http://localhost:3000/fossnote/**

### Installation avec Docker (bientôt disponible)

```bash
docker-compose up -d
```

---

## 💻 Utilisation

### Comptes de démonstration

Pour tester Fossnote, utilisez ces identifiants :

**Compte Élève :**
- Identifiant : `akaty`
- Mot de passe : `Password123!`

**Compte Professeur :**
- Identifiant : `pgothier`
- Mot de passe : `Password123!`

⚠️ **Important** : Changez ces mots de passe en production !

### Accès aux différents espaces

- **Accueil** : http://localhost:3000/fossnote/
- **Espace Élèves** : http://localhost:3000/fossnote/eleve.html
- **Espace Professeurs** : http://localhost:3000/fossnote/professeur.html
- **Espace Parents** : http://localhost:3000/fossnote/parent.html
- **Vie Scolaire** : http://localhost:3000/fossnote/viescolaire.html

### Scripts disponibles

```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement avec auto-reload
npm test           # Lancer les tests
npm run lint       # Vérifier le code
npm run db:setup   # Initialiser la base de données
npm run db:seed    # Ajouter des données de test
```

---

## 🔒 Conformité RGPD

Fossnote intègre une **conformité RGPD complète** dès sa conception :

### Fonctionnalités RGPD

- ✅ **Consentement aux cookies** - Banner conforme CNIL
- ✅ **Droits des utilisateurs** :
  - Droit d'accès (téléchargement des données)
  - Droit de rectification
  - Droit à l'effacement (droit à l'oubli)
  - Droit à la portabilité
  - Droit d'opposition
- ✅ **Traçabilité** - Logs d'audit des accès
- ✅ **Transparence** - Politique de confidentialité détaillée
- ✅ **Sécurité** - Chiffrement et protection des données
- ✅ **Nettoyage automatique** - Suppression des données périmées

### Pages légales

- **Politique de confidentialité** : `/fossnote/politique-confidentialite`
- **Mentions légales** : `/fossnote/mentions-legales`
- **Gestion des cookies** : Banner avec options personnalisables

### API RGPD

```javascript
// Télécharger toutes ses données
GET /fossnote/api/gdpr/mes-donnees

// Demander la suppression de son compte
POST /fossnote/api/gdpr/demande-suppression

// Rectifier ses données
POST /fossnote/api/gdpr/rectifier-donnees

// Consulter ses consentements
GET /fossnote/api/gdpr/mes-consentements
```

📖 [Guide complet d'installation RGPD](docs/GUIDE_INSTALLATION_RGPD.md)

---

## 📚 Documentation

- **[Guide d'installation](docs/INSTALLATION.md)** - Installation détaillée
- **[Guide RGPD](docs/GUIDE_INSTALLATION_RGPD.md)** - Conformité RGPD
- **[API Documentation](docs/API.md)** - Documentation de l'API
- **[Guide de contribution](CONTRIBUTING.md)** - Comment contribuer
- **[Protocoles PRONOTE](docs/PROTOCOLES.md)** - Protocoles client/serveur (à venir)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md) pour démarrer.

### Comment contribuer ?

1. 🍴 **Forkez** le projet
2. 🔧 **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. ✍️ **Committez** vos changements (`git commit -m 'feat: Add AmazingFeature'`)
4. 📤 **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. 🔃 **Ouvrez** une Pull Request

### Domaines de contribution

- 💻 Développement de fonctionnalités
- 🐛 Correction de bugs
- 📖 Amélioration de la documentation
- 🌍 Traductions
- 🎨 Design et UX
- 🧪 Tests et qualité

---

## 🛡️ Sécurité

La sécurité est notre priorité. Si vous découvrez une vulnérabilité :

- **NE créez PAS d'issue publique**
- Consultez notre [politique de sécurité](SECURITY.md)
- Contactez-nous à : [INSÉRER EMAIL SÉCURITÉ]

---

## 🗺️ Roadmap

### Version 0.3 (Q1 2025)
- [ ] Saisie complète des notes par les professeurs
- [ ] Système de messagerie interne
- [ ] Emploi du temps dynamique
- [ ] Export PDF des bulletins

### Version 0.4 (Q2 2025)
- [ ] Application mobile (PWA)
- [ ] Notifications push
- [ ] API publique documentée
- [ ] Système de plugins

### Version 1.0 (Q3 2025)
- [ ] Toutes les fonctionnalités PRONOTE essentielles
- [ ] Tests complets
- [ ] Documentation exhaustive
- [ ] Support multi-établissements

📋 [Voir la roadmap complète](https://github.com/chblitz62/fossnote/projects)

---

## 📊 Statistiques

![GitHub repo size](https://img.shields.io/github/repo-size/chblitz62/fossnote)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/chblitz62/fossnote)
![GitHub last commit](https://img.shields.io/github/last-commit/chblitz62/fossnote)

---

## 📄 License

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Crédits

### Créateurs

- **Fufly / CaraPloof** - *Créateur original* - [GitHub](https://github.com/xFufly)
- **chblitz62** - *Mainteneur* - [GitHub](https://github.com/chblitz62)

### Contributeurs

Merci à tous les [contributeurs](https://github.com/chblitz62/fossnote/graphs/contributors) qui ont participé à ce projet !

### Technologies utilisées

- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Express](https://expressjs.com/) - Framework web
- [SQLite](https://www.sqlite.org/) - Base de données
- [Helmet](https://helmetjs.github.io/) - Sécurité HTTP

---

## 📞 Contact & Support

- **Issues GitHub** : [Créer une issue](https://github.com/chblitz62/fossnote/issues)
- **Discussions** : [GitHub Discussions](https://github.com/chblitz62/fossnote/discussions)
- **Email** : [INSÉRER EMAIL]

---

## 💖 Soutenir le projet

Si Fossnote vous aide, vous pouvez soutenir le projet :

- ⭐ **Star** le dépôt sur GitHub
- 🐛 Signaler des bugs
- 💡 Proposer des améliorations
- 📣 Parler de Fossnote autour de vous
- 💻 Contribuer au code

---

<div align="center">

**Fait avec ❤️ par la communauté open source**

[⬆ Retour en haut](#fossnote)

</div>
