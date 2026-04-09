# MMI Archives - Gestion des SAé BUT MMI

Plateforme moderne de gestion et d'archivage des Situations d'Apprentissage et d'Évaluation (SAé) pour les étudiants du BUT MMI. Ce projet se compose d'une API Spring Boot robuste et d'une application mobile fluide développée avec React Native (Expo).

---

## 🏗️ Architecture du Projet

Le dépôt est structuré de la manière suivante :

- **`/api`** : Code source du backend Spring Boot (Java).
- **`/mobile`** : Application mobile React Native / Expo.
- **`/docker`** : Fichiers de configuration Docker pour le déploiement local.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Docker](https://www.docker.com/) et Docker Compose.
- [Node.js](https://nodejs.org/) (LTS recommandé).
- Un gestionnaire de paquets comme `npm` ou `yarn`.

---

## 🚀 Lancement de l'API (Backend)

L'API et sa base de données MySQL sont entièrement conteneurisées pour faciliter le déploiement.

1.  Ouvrez un terminal à la racine du projet.
2.  Lancez les services via Docker Compose :
    ```bash
    docker compose -f docker/docker-compose.yml up -d --build
    ```
3.  L'API sera accessible sur `http://localhost:8080`.
4.  La base de données MySQL sera accessible sur le port `3306`.

*Note : Le conteneur API attend que la base de données soit saine (healthcheck) avant de démarrer.*

---

## 📱 Lancement de l'Application (Mobile)

L'application mobile utilise Expo pour une expérience de développement simplifiée.

1.  Naviguez dans le dossier mobile :
    ```bash
    cd mobile
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  **Configuration de l'IP :**
    Si vous testez sur un appareil physique, modifiez l'URL de l'API dans `mobile/constants/IPServer.ts` en remplaçant `localhost` par l'adresse IP locale de votre machine.
4.  Lancez l'application :
    ```bash
    npx expo start
    ```
5.  Scannez le QR Code avec l'application **Expo Go** (Android/iOS) ou appuyez sur `w` pour la version Web.

---

## 🛠️ Fonctionnalités Principales

- **Exploration** : Liste complète des SAé avec recherche et filtrage.
- **Filtrage Intelligent** : Par année (MMI2/MMI3) ou par domaine (Web, Création, etc.).
- **Classement** : Visualisation des projets par note.
- **Galerie** : Exposition visuelle des réalisations étudiantes.
- **Gestion** : Ajout de nouveaux projets via un formulaire dédié.

---

## ⚠️ Note Importante

**Seul notre projet est actuellement opérationnel dans cette application.** Les liens externes ou redirections vers d'autres projets tiers ne sont pas fonctionnels car nous ne disposons pas des accès ou des ressources nécessaires pour ces derniers.

---

*Développé dans le cadre du BUT MMI — IUT de Marne-la-Vallée (Meaux).*
