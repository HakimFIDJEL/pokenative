# Pokenative

Une application Pokédex simple et performante développée avec React Native et Expo.

Ce projet a été réalisé en suivant le tutoriel de **Grafikart**. L'objectif était d'apprendre les bases de React Native, la navigation avec Expo Router, et la gestion des données avec TanStack Query pour créer des applications mobiles fluides.

## Fonctionnalités

- **Navigation Fluide** : Utilisation d'Expo Router pour une navigation basée sur le système de fichiers.
- **Liste Infinie** : Chargement progressif des Pokémon (Infinite Scroll) avec TanStack Query.
- **Vue Détail Native** : Système de pagination "native" permettant de naviguer entre les Pokémon par simple swipe (utilisant une `FlatList` optimisée).
- **Informations Complètes** : Accès aux statistiques de base, types, poids, taille et biographie de chaque Pokémon.
- **Audio** : Intégration des cris originaux des Pokémon via l'API.
- **Design Soigné** : Interface épurée avec gestion dynamique des couleurs basée sur le type du Pokémon.

## Installation

1. Installez les dépendances :

   ```bash
   npm install
   ```

2. Lancez le projet :
   ```bash
   npm run start
   ```

## Technologies utilisées

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [PokeAPI](https://pokeapi.co/)
