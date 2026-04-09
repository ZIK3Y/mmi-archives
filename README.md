# SAé MMI — Application Mobile React Native

Application mobile Expo/React Native pour la gestion des SAé BUT MMI (MMI2 & MMI3) de l'IUT MLV Meaux.

## Configuration du back-end

```bash
cd docker
docker compose up --build -d
```

## Lancement du front-end

```bash
cd mobile
npm install
npx expo start
```

## Partie Admin

Pour accèder au fonctionnalité administrateur (ajout, modification et suppression de SAÉ et de groupe) il faut se connecter.
Pour se faire utiliser le login *admin* et le mot de passe *mmi2026*
