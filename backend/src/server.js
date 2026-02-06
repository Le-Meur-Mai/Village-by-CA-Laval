// Importe le package http natif de node pour gérer les requêtes http
import http from 'http';
// Importe l'application du fichier app, qu'on va créer après
import app from './app.js';

/* 
Défini un port d'écoute
process.env.PORT prend le port d'écoute envoyé par l'environnement, sinon prend
le port 3000 par défaut
*/
const port = process.env.PORT || 3000;

// Spécifie de port d'écoute pour l'application
app.set('port', port);

/* 
Crée un serveur avec la méthode du module http
Il prend comme argument notre app, qui va gérer les requêtes et les 
réponses http
*/
const server = http.createServer(app);

// Spécifie le port d'écoute du serveur et affiche un message dans la console
server.listen(port, () => {
  console.log(`Serveur lance sur le port ${port}`);
});
