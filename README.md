Media Collection
===========
Gestionnaire de médiathèque par collections

## Description
L’application MediaCollection est un gestionnaire de collection de media (DVD, livres, BD, …).
Elle permet de gérer les collections de l’utilisateur en proposant un accès à distance via une
application mobile ou un navigateur. 

L’application pourra enregistrer des œuvres de manière indépendantes (comme un film ou
un livre qui ne fait pas partie d’une série) ou une série de media comme par exemple les 
saisons d’une série TV ou un ensemble de livres faisant partie de la même série (comme des bandes-dessinées).

## Mise en place de Media Collection

### Installation

Installer Media collection nécessite : 

- [MongoDB](http://www.mongodb.org/downloads)
- [Node.js](http://nodejs.org/download/)

puis dans les dossiers `app`, `webapp/main` et `webapp/main/public`, tapez :
```
npm install 
```
### Execution

Pour lancer Media Collection, tapez à la racine du projet
```
gulp
```

et lancer le serveur avec la commande node ou tout autre utilitaire de votre choix (pm2, nodemon, etc) depuis la racine: 
```
node app/server.js
```

L'application est disponible sur : 
- http://localhost:4000


#### Contributeurs
- Starlight (co-fondateur du projet et développeur)
- Kaze (co-fondateur du projet et développeur)
