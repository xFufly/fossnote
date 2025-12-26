# Politique de Sécurité

## Versions supportées

Nous publions des correctifs de sécurité pour les versions suivantes de Fossnote :

| Version | Supportée          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :x:                |
| < 0.1   | :x:                |

## Signaler une vulnérabilité

La sécurité de Fossnote est une priorité. Si vous découvrez une vulnérabilité de sécurité, nous vous remercions de nous en informer de manière responsable.

### Comment signaler

**⚠️ Ne créez PAS d'issue publique pour les problèmes de sécurité.**

Au lieu de cela, veuillez :

1. **Envoyer un email** à : [INSÉRER ADRESSE EMAIL DE SÉCURITÉ]
   - Utilisez un sujet clair : `[SÉCURITÉ] Description courte`
   - Incluez autant de détails que possible

2. **Informations à inclure** :
   - Type de vulnérabilité (ex: SQL injection, XSS, CSRF, etc.)
   - Chemins complets des fichiers source affectés
   - Emplacement du code vulnérable (tag/branche/commit)
   - Configuration spéciale requise pour reproduire le problème
   - Instructions étape par étape pour reproduire le problème
   - Preuve de concept ou code d'exploitation (si possible)
   - Impact potentiel de la vulnérabilité

3. **Chiffrement** (recommandé pour les vulnérabilités critiques) :
   - Clé PGP disponible sur demande
   - Ou utilisez [INSÉRER PLATEFORME SÉCURISÉE]

### Ce à quoi vous pouvez vous attendre

- **Accusé de réception** : Nous accuserons réception de votre rapport dans les **48 heures**
- **Évaluation initiale** : Nous évaluerons la vulnérabilité et vous tiendrons informé dans les **5 jours ouvrables**
- **Correction** : Nous travaillerons sur un correctif et vous informerons de sa progression
- **Publication** : Une fois le correctif déployé, nous publierons un avis de sécurité
- **Crédit** : Avec votre accord, nous vous créditerons dans l'avis de sécurité

### Processus de divulgation

Nous suivons le principe de **divulgation coordonnée** :

1. Vous signalez la vulnérabilité de manière privée
2. Nous confirmons la vulnérabilité et travaillons sur un correctif
3. Nous publions le correctif dans toutes les versions supportées
4. Nous publions un avis de sécurité avec les détails
5. Vous pouvez publier vos propres détails après notre avis

**Délai recommandé** : 90 jours entre le rapport initial et la divulgation publique.

## Bonnes pratiques de sécurité

Si vous utilisez Fossnote en production, nous recommandons :

### Configuration serveur

- [ ] **HTTPS obligatoire** : Utilisez toujours HTTPS en production
- [ ] **Headers de sécurité** : Helmet est activé et configuré
- [ ] **Rate limiting** : Activé pour toutes les routes sensibles
- [ ] **CORS** : Configuré strictement si nécessaire
- [ ] **Pare-feu** : Configuré pour n'autoriser que les ports nécessaires

### Base de données

- [ ] **Sauvegardes régulières** : Automatisez les backups de `database.db`
- [ ] **Permissions fichiers** : `database.db` accessible uniquement au serveur
- [ ] **Requêtes préparées** : Toujours utiliser des requêtes préparées (déjà implémenté)

### Authentification et sessions

- [ ] **Mots de passe forts** : Imposez une politique de mots de passe robuste
- [ ] **Hashage sécurisé** : Utilisez bcrypt/argon2 (à implémenter)
- [ ] **Sessions sécurisées** : 
  - `SESSION_SECRET` fort et aléatoire
  - `httpOnly`, `secure`, `sameSite` activés
- [ ] **Expiration** : Sessions expirent après inactivité
- [ ] **2FA** : Envisagez l'authentification à deux facteurs (future fonctionnalité)

### Mises à jour

- [ ] **Dépendances** : Maintenez Node.js et les dépendances npm à jour
- [ ] **Surveillance** : Utilisez `npm audit` régulièrement
- [ ] **Notifications** : Activez GitHub Dependabot

### Logs et monitoring

- [ ] **Logs sécurisés** : Ne loggez jamais de mots de passe ou tokens
- [ ] **Monitoring** : Surveillez les tentatives de connexion échouées
- [ ] **Alertes** : Configurez des alertes pour activités suspectes

### RGPD et données personnelles

- [ ] **Minimisation** : Ne collectez que les données nécessaires
- [ ] **Chiffrement** : Données sensibles chiffrées au repos et en transit
- [ ] **Durée de conservation** : Respectez les durées légales
- [ ] **Droits utilisateurs** : API RGPD fonctionnelle

## Vulnérabilités connues

### Actuelles (à corriger)

- **Stockage des mots de passe** : Les mots de passe doivent être hashés avec bcrypt/argon2
- **Protection CSRF** : À implémenter pour toutes les requêtes POST
- **Validation des entrées** : Renforcer la validation côté serveur

### Corrigées

Aucune vulnérabilité corrigée pour le moment (première release).

## Programme de Bug Bounty

Actuellement, Fossnote n'a pas de programme officiel de bug bounty. Cependant, nous apprécions grandement les rapports de sécurité et mentionnerons les chercheurs dans nos remerciements.

## Ressources additionnelles

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Guide de sécurité Node.js](https://nodejs.org/en/docs/guides/security/)
- [CNIL - Sécurité des données](https://www.cnil.fr/fr/securite-des-donnees)
- [ANSSI - Bonnes pratiques](https://www.ssi.gouv.fr/administration/bonnes-pratiques/)

## Contact

Pour toute question relative à la sécurité :
- Email : [INSÉRER EMAIL DE SÉCURITÉ]
- Issues GitHub (pour questions générales, non-sensibles) : https://github.com/chblitz62/fossnote/issues

---

**Merci d'aider à garder Fossnote sécurisé !** 🔒
