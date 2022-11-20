# ColourYou

Voici notre API ColourYou

Par Stefano Attanasio, Aline Chacón, Salomé Gfeller et Aleksandar Srbinovski.

## Utilisation

L'app permet de gérer des personnes, des images et des couleurs.

Lisez la [documentation complète](https://colouryou.onrender.com/api-docs/) pour plus de détails.

### En ligne

L'app est disponible en ligne à l'adresse https://colouryou.onrender.com.

### En local

```bash
# Cloner le dossier
git clone https://github.com/salomegf/colouryou.git

# Installer les dépendances
cd colouryou
npm install

# Lancer l'application
npm start
```

L'app va essayer de se connecter à la base de donnée MongoDB `mongodb://127.0.0.1/coloryou` si aucune variable d'environnement `$DATABASE_URL` n'est définie.

## WebSocket 
Deux types de messages vont être envoyés en temps réel.
1. Lorsqu'un nouvel utilisateur est créé. Un message sera envoyé avec le terme "userCreated" et le username du nouvel utilisateur.
2. Lorsqu'une couleur est ajoutée, un message sera envoyé avec le terme "colorAdded" et le nom de celle-ci.

## Tests automatisés

La suite de tests peut être lancée avec `npm test`.

L'app va tenter de se connecter à la base de donnée MongoDB `mongodb://127.0.0.1/colouryou-test`.
