# SAé MMI — Application Mobile React Native

Application mobile Expo/React Native pour la gestion des SAé BUT MMI (MMI2 & MMI3) de l'IUT MLV Meaux.

## Fonctionnalités

- 📚 Liste de toutes les SAé avec recherche
- 📗 Filtrage par année (MMI2 / MMI3)
- 🗂️ Filtrage par domaine (Web, Dev, DI, 3D, Création…)
- 🏆 Classement par note
- 🖼️ Galerie photos avec lightbox
- 📝 Détail complet d'une SAé (compétences, groupe, liens, images)
- ➕ Formulaire d'ajout de SAé (POST vers le back-end Spring Boot)

## Installation

```bash
npm install
npx expo start
```

## Configuration du back-end

Édite le fichier `constants/IPServer.ts` et remplace l'URL par celle de ton serveur Spring Boot :

```ts
const IP = 'http://192.168.X.X:8080'; // ton IP locale
// ou en prod :
const IP = 'https://ton-serveur.com';
```

## Structure du projet

```
mmi-sae-app/
├── api/
│   └── SaeApi.ts           ← Appels HTTP vers l'API Spring Boot
├── app/
│   ├── _layout.tsx         ← Layout racine Expo Router
│   ├── index.tsx           ← Menu principal
│   ├── sae/
│   │   ├── index.tsx       ← Liste toutes les SAé
│   │   ├── [idSae].tsx     ← Détail d'une SAé
│   │   ├── parAnnee.tsx    ← Filtre MMI2 / MMI3
│   │   ├── parDomaine.tsx  ← Filtre par domaine
│   │   ├── classement.tsx  ← Tri par note décroissante
│   │   └── galerie.tsx     ← Galerie photos toutes SAé
│   └── ajout/
│       └── index.tsx       ← Formulaire d'ajout (POST)
├── components/
│   ├── SaeCard.tsx         ← Carte résumé d'une SAé
│   ├── DomaineBadge.tsx    ← Badge coloré par domaine
│   └── BackHeader.tsx      ← En-tête avec bouton retour
├── constants/
│   ├── Colors.ts           ← Palette de couleurs
│   ├── IPServer.ts         ← URL du serveur back-end
│   └── ScreenDimensions.ts
├── hooks/
│   └── useSaeList.ts       ← Hook de récupération des SAé
└── types/
    └── types.ts            ← Interfaces TypeScript (Sae, GroupeMembre…)
```

## Endpoints API attendus (Spring Boot)

| Méthode | Route                    | Description                    |
|---------|--------------------------|--------------------------------|
| GET     | /api/saes                | Toutes les SAé                 |
| GET     | /api/saes/:id            | Détail d'une SAé               |
| GET     | /api/saes/annee/:annee   | SAé par année (MMI2 / MMI3)    |
| GET     | /api/saes/domaine/:dom   | SAé par domaine                |
| GET     | /api/saes/classement     | SAé triées par note desc       |
| GET     | /api/saes/:id/images     | Images d'une SAé               |
| POST    | /api/saes                | Créer une SAé                  |
