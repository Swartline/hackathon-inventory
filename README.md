# Hackathon 2024 - Inventaire avec système d'échange

## Nom/Pseudo des développeurs

- Matteo MARINHO / Swartline
- Rayan Malonzo / ryanmalonzo
- Frederic LOPEZ / Fred-57

## Listing des fonctionnalités

- Front inventaire (Rayan Malonzo - Frederic LOPEZ - Matteo MARINHO)
- Gestion inventaire (Matteo MARINHO)
- Assigner des objets à un joueur (Rayan Malonzo)
- Visualisation des détails objet: nom, description, souhait de l'échanger (Ryan MALONZO, Frederic LOPEZ)
- Pouvoir importer des images localement dans nos iframes (Ryan MALONZO)
- Récupérer l’inventaire d’un autre joueur (Matteo MARINHO)
- Interface échange (Ryan MALONZO, Frederic LOPEZ)
- Fonctionnalité échange (Ryan MALONZO, Frederic LOPEZ)
- Annulation d'un échange (Ryan MALONZO, Frederic LOPEZ)
- Gestion des problèmes de sécurité d'un échange (Matteo MARINHO - Ryan MALONZO, Frederic LOPEZ)
- Création d'un système de classement (Ryan MALONZO)

## Procédure d'installation

- Cloner le repo
- Puis installer les dépendances (nécessite [node](https://nodejs.org/en/) > 17)

```
npm install
npm run dev
```

## Utiliser notre solution

Une fois arriver sur la carte :

1. Ouvrir son inventaire en appuyant sur l'icone sac à dos sur la barre d'action (barre horizontale en bas de l'écran)

2. Fermer l'inventaire (en appuyant sur le même bouton que pour l'ouvrir)

3. S'approcher d'un autre joueur (jusqu'à qu'une bulle apparaisse autour des deux joueurs)

4. Appuyer sur l'autre joueur (ou appuyer sur la barre d'espace)

5. Séléctionner les objets que vous désirez échanger

6. Confirmer votre échange

7. Attendre que l'autre joueurs confirme son échange

8. Visualiser vos nouveaux objets dans votre inventaire

## WorkAdventure Map Starter Kit

![map](./map.png)

This is a starter kit to help you build your own map for [WorkAdventure](https://workadventu.re).

To understand how to use this starter kit, follow the tutorial at [https://workadventu.re/map-building](https://workadventu.re/map-building).

## Structure

- _public_: Static files like PDFs or audio files
- _src_: Scripts files
- _tilesets_: All tilesets
- _map.tmj_: Map file
- _map.png_: The map thumbnail displayed on the in-game map information

If you want to use more than one map file, just add the new map file on root or in a folder.

we recommend using 500x500 images for the map thumbnails.

If you are going to create custom websites to embed in the map, please reference the HTML files in the `input` option in _vite.config.js_.

## Requirements

Node.js version >=17

## Installation

With npm installed (comes with [node](https://nodejs.org/en/)), run the following commands into a terminal in the root directory of this project:

```shell
npm install
npm run dev
```

## Test production map

You can test the optimized map as it will be in production:

```sh
npm run build
npm run prod
```

## Licenses

This project contains multiple licenses as follows:

- [Code license](./LICENSE.code) _(all files except those for other licenses)_
- [Map license](./LICENSE.map) _(`map.tmj` and the map visual as well)_
- [Assets license](./LICENSE.assets) _(the files inside the `src/assets/` folder)_

### About third party assets

If you add third party assets in your map, do not forget to:

1. Credit the author and license with the "tilesetCopyright" property present in the properties of each tilesets in the `map.tmj` file
2. Add the license text in LICENSE.assets
