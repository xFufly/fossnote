# 🎓 AFERTES - Portail de Formation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/progressive-web-apps/)

Portail web pour le centre de formation **AFERTES** (Association pour la Formation, l'Expérimentation et la Recherche en Travail Éducatif et Social).

🌐 Site officiel : [afertes.org](https://afertes.org)

![AFERTES Logo](https://afertes.org/wp-content/uploads/2024/12/cropped-Afertes-logo-175x56.png)

---

## ✨ Fonctionnalités

### 👥 Gestion des utilisateurs
- **Inscription** avec validation email
- **Connexion sécurisée** (mot de passe hashé)
- **Récupération de mot de passe**
- **Profils personnalisables** avec photo

### 🎓 Espace Étudiants
- Fiche personnelle complète
- Consultation des notes
- Emploi du temps
- Messagerie avec les formateurs

### 👨‍🏫 Espace Formateurs
- Publication d'actualités (avec images)
- Attribution des notes
- Gestion des emplois du temps
- Liste des étudiants avec moyennes
- Choix des sites d'intervention

### 📚 Formations disponibles
| Code | Formation |
|------|-----------|
| ES | Éducateur Spécialisé |
| ME | Moniteur Éducateur |
| AES | Accompagnant Éducatif et Social |
| CAFERUIS | Certificat d'Aptitude aux Fonctions d'Encadrement |
| CAFDES | Certificat d'Aptitude aux Fonctions de Direction |

### 📍 Sites de formation
- **Saint-Laurent-Blangy** (Arras)
- **Avion**

---

## 🚀 Installation

### Option 1 : Fichier unique (recommandé pour tester)
1. Téléchargez `index.html`
2. Ouvrez-le dans votre navigateur
3. C'est prêt !

### Option 2 : Serveur local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000
```

### Option 3 : Hébergement en ligne (gratuit)
- [Netlify](https://netlify.com) - Glissez-déposez le dossier
- [Vercel](https://vercel.com) - Connectez votre GitHub
- [GitHub Pages](https://pages.github.com) - Activez dans les paramètres du repo

---

## 📱 Progressive Web App (PWA)

L'application peut être **installée** sur :
- 📱 **Android** : Chrome → Menu → "Ajouter à l'écran d'accueil"
- 📱 **iPhone** : Safari → Partager → "Sur l'écran d'accueil"
- 💻 **Windows/Mac** : Chrome → Barre d'adresse → Icône d'installation

---

## 🔐 Comptes de test

| Type | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@afertes.org` | `Admin123!` |

Ou créez votre propre compte via l'inscription !

---

## 🛠️ Technologies

- **HTML5** / **CSS3** / **JavaScript** (Vanilla)
- **LocalStorage** pour la persistance des données
- **PWA** avec manifest et service worker
- **Responsive Design** (mobile-first)
- **Charte graphique AFERTES** officielle

---

## 📁 Structure du projet

```
afertes-portail/
├── index.html          # Application principale
├── manifest.json       # Configuration PWA
├── sw.js              # Service Worker (offline)
├── README.md          # Documentation
└── assets/
    └── icons/         # Icônes PWA (optionnel)
```

---

## 🔧 Configuration

### Personnaliser les formations
Dans `index.html`, modifiez l'objet `CONFIG` :

```javascript
const CONFIG = {
    promos: ['ES', 'ME', 'AES', 'CAFERUIS', 'CAFDES'],
    sites: ['SLB', 'Avion'],
    siteNames: { 'SLB': 'Saint-Laurent-Blangy', 'Avion': 'Avion' }
};
```

### Connecter à un backend
Pour une utilisation en production avec base de données :
1. Remplacez les fonctions `getData()` / `setData()` par des appels API
2. Implémentez l'authentification côté serveur
3. Ajoutez l'envoi d'emails pour la récupération de mot de passe

---

## 🚧 Roadmap

- [ ] Backend Node.js / Express
- [ ] Base de données PostgreSQL
- [ ] Envoi d'emails (SendGrid)
- [ ] Upload de fichiers (emplois du temps PDF)
- [ ] Notifications push
- [ ] Export PDF des notes
- [ ] Calendrier interactif

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📞 Contact

**AFERTES**
- 🌐 Site : [afertes.org](https://afertes.org)
- 📍 Saint-Laurent-Blangy : 1 rue Pierre et Marie Curie, 62223
- 📍 Avion : Rue des Montagnards, 62210
- 📞 Téléphone : 03 21 60 40 00

---

<p align="center">
  Fait avec ❤️ pour l'AFERTES
</p>
