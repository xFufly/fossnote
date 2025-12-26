# Guide de contribution à Fossnote

Merci de votre intérêt pour contribuer à Fossnote ! 🎉

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Développement local](#développement-local)
- [Soumettre des changements](#soumettre-des-changements)
- [Standards de code](#standards-de-code)
- [Processus de review](#processus-de-review)

## Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite. Soyez respectueux, inclusif et professionnel dans toutes vos interactions.

## Comment contribuer

Il existe plusieurs façons de contribuer à Fossnote :

### 🐛 Signaler des bugs

Si vous trouvez un bug :

1. Vérifiez d'abord que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/chblitz62/fossnote/issues)
2. Si ce n'est pas le cas, créez une nouvelle issue avec :
   - Un titre clair et descriptif
   - Une description détaillée du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement observé
   - Votre environnement (OS, version Node.js, navigateur, etc.)
   - Des captures d'écran si pertinent

**Template de rapport de bug :**

```markdown
## Description du bug
[Description claire et concise]

## Étapes pour reproduire
1. Aller sur '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Voir l'erreur

## Comportement attendu
[Ce qui devrait se passer]

## Comportement observé
[Ce qui se passe réellement]

## Environnement
- OS: [ex. Windows 11]
- Node.js: [ex. v18.17.0]
- Navigateur: [ex. Chrome 120]

## Captures d'écran
[Si applicable]
```

### ✨ Proposer de nouvelles fonctionnalités

Avant de travailler sur une nouvelle fonctionnalité :

1. Ouvrez une issue pour en discuter avec les mainteneurs
2. Expliquez clairement le problème que vous souhaitez résoudre
3. Proposez votre solution
4. Attendez les retours avant de commencer le développement

**Template de proposition :**

```markdown
## Problème à résoudre
[Quel problème cette fonctionnalité résout-elle ?]

## Solution proposée
[Comment proposez-vous de le résoudre ?]

## Alternatives considérées
[Quelles autres solutions avez-vous envisagées ?]

## Informations complémentaires
[Tout autre contexte ou captures d'écran]
```

### 📖 Améliorer la documentation

La documentation peut toujours être améliorée ! Vous pouvez :

- Corriger des fautes de frappe
- Clarifier des explications confuses
- Ajouter des exemples
- Traduire la documentation
- Améliorer le README

### 💻 Contribuer au code

Consultez les [issues avec le label "good first issue"](https://github.com/chblitz62/fossnote/labels/good%20first%20issue) pour commencer.

## Développement local

### Prérequis

- Node.js v14 ou supérieur
- npm v6 ou supérieur
- Git

### Installation

1. **Forkez le dépôt** sur GitHub

2. **Clonez votre fork** :
```bash
git clone https://github.com/VOTRE_NOM/fossnote.git
cd fossnote
```

3. **Ajoutez le dépôt original comme remote** :
```bash
git remote add upstream https://github.com/chblitz62/fossnote.git
```

4. **Installez les dépendances** :
```bash
npm install
```

5. **Créez les tables de la base de données** :
```bash
# Si le script existe
node scripts/setup-database.js
```

6. **Lancez le serveur de développement** :
```bash
npm start
```

7. **Accédez à l'application** : http://localhost:3000/fossnote/

### Structure du projet

```
fossnote/
├── src/
│   ├── routes/          # Routes Express
│   ├── services/        # Services métier
│   ├── public/          # Fichiers statiques (HTML, CSS, JS)
│   └── server.js        # Point d'entrée du serveur
├── scripts/             # Scripts utilitaires
├── docs/                # Documentation
├── tests/               # Tests unitaires et d'intégration
├── database.db          # Base de données SQLite (git-ignoré)
├── package.json         # Dépendances et scripts
└── README.md            # Documentation principale
```

## Soumettre des changements

### Workflow Git

1. **Créez une branche** pour votre fonctionnalité ou correction :
```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-du-bug
```

**Convention de nommage des branches :**
- `feature/` pour les nouvelles fonctionnalités
- `fix/` pour les corrections de bugs
- `docs/` pour la documentation
- `refactor/` pour le refactoring
- `test/` pour les tests
- `chore/` pour les tâches de maintenance

2. **Faites vos modifications** et committez régulièrement :
```bash
git add .
git commit -m "feat: Ajout de la fonctionnalité X"
```

**Convention de commit (Conventional Commits) :**
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, points-virgules manquants, etc.
- `refactor:` Refactoring du code
- `test:` Ajout de tests
- `chore:` Maintenance, mise à jour des dépendances

**Exemples de bons commits :**
```bash
git commit -m "feat: Ajout du système de notation pour les professeurs"
git commit -m "fix: Correction du bug de connexion sur Safari"
git commit -m "docs: Mise à jour du guide d'installation"
git commit -m "refactor: Simplification de la gestion des sessions"
```

3. **Synchronisez avec upstream** régulièrement :
```bash
git fetch upstream
git rebase upstream/master
```

4. **Poussez votre branche** :
```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

5. **Créez une Pull Request** sur GitHub

### Checklist avant de soumettre une PR

- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements localement
- [ ] J'ai ajouté/mis à jour les tests si nécessaire
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Mes commits suivent la convention Conventional Commits
- [ ] Ma branche est à jour avec `master`
- [ ] J'ai vérifié qu'il n'y a pas de conflits
- [ ] J'ai ajouté des commentaires pour le code complexe

### Description de la Pull Request

Utilisez ce template pour décrire votre PR :

```markdown
## Type de changement

- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui casserait la compatibilité)
- [ ] Documentation

## Description

[Décrivez clairement ce que fait votre PR]

## Issue liée

Closes #[numéro de l'issue]

## Comment tester

1. Cloner la branche
2. Installer les dépendances : `npm install`
3. Lancer le serveur : `npm start`
4. Tester [décrire les étapes de test]

## Captures d'écran

[Si applicable]

## Checklist

- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation
- [ ] Mes commits suivent la convention
- [ ] Ma branche est à jour avec master
```

## Standards de code

### JavaScript

- **Style** : Utilisez ESLint (configuration à venir)
- **Indentation** : 2 ou 4 espaces (cohérence dans tout le projet)
- **Quotes** : Guillemets simples `'` préférés
- **Semicolons** : Obligatoires
- **Nommage** :
  - `camelCase` pour les variables et fonctions
  - `PascalCase` pour les classes
  - `UPPER_CASE` pour les constantes

**Exemple :**
```javascript
const userService = require('./services/user');

class UserController {
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = UserController;
```

### HTML/CSS

- **Indentation** : 2 espaces
- **Classes CSS** : kebab-case (`ma-classe`)
- **IDs** : camelCase ou kebab-case (cohérence)
- **Sémantique** : Utilisez les balises HTML5 sémantiques

### SQL

- **Mots-clés** : UPPERCASE
- **Tables/colonnes** : snake_case
- **Indentation** : Lisible et cohérente

**Exemple :**
```sql
SELECT 
  u.id, 
  u.username, 
  u.email
FROM users u
WHERE u.active = 1
ORDER BY u.created_at DESC;
```

### Commentaires

- Commentez le **pourquoi**, pas le **quoi**
- Utilisez JSDoc pour les fonctions publiques

**Exemple :**
```javascript
/**
 * Calcule la moyenne des notes d'un élève pour une période donnée
 * @param {number} studentId - ID de l'élève
 * @param {number} periodId - ID de la période
 * @returns {Promise<number>} Moyenne calculée
 */
async function calculateAverage(studentId, periodId) {
  // Implémentation...
}
```

## Processus de review

### Pour les contributeurs

1. Une fois votre PR soumise, attendez la review
2. Soyez ouvert aux suggestions et critiques constructives
3. Répondez aux commentaires et faites les ajustements demandés
4. Mettez à jour votre PR si nécessaire
5. Une fois approuvée, un mainteneur mergera votre PR

### Temps de réponse

Les mainteneurs s'efforcent de répondre aux PR dans un délai de **3-5 jours ouvrables**. Si vous n'avez pas de nouvelles après une semaine, n'hésitez pas à relancer poliment.

## Tests

### Exécuter les tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec couverture
npm run test:coverage
```

### Écrire des tests

Tout nouveau code devrait idéalement être accompagné de tests. Utilisez Jest ou un framework similaire.

**Exemple de test :**
```javascript
describe('UserService', () => {
  test('devrait retourner un utilisateur par ID', async () => {
    const user = await userService.findById(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });
  
  test('devrait retourner null si utilisateur inexistant', async () => {
    const user = await userService.findById(99999);
    expect(user).toBeNull();
  });
});
```

## Questions ?

Si vous avez des questions :

1. Consultez d'abord la [documentation](docs/)
2. Recherchez dans les [issues existantes](https://github.com/chblitz62/fossnote/issues)
3. Ouvrez une nouvelle issue avec le label `question`
4. Rejoignez nos discussions sur [GitHub Discussions](https://github.com/chblitz62/fossnote/discussions)

## Remerciements

Merci à tous les contributeurs qui participent à l'amélioration de Fossnote ! 🙏

Votre contribution, qu'elle soit grande ou petite, est précieuse pour la communauté.

---

**Note :** Ce guide de contribution peut évoluer. N'hésitez pas à proposer des améliorations !
