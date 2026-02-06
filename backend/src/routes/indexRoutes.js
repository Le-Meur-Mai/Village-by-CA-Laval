// Importe le package express
import express from 'express'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const indexRouteur = express.Router();

// Définitions des différentes routes et méthodes
indexRouteur.get('/', (req, res) => {
  res.json({message: 'Page index'});
});

// Export du routeur
export default indexRouteur;
