// Importe le package express
import express from 'express'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const startupsRouteur = express.Router();

// Définitions des différentes routes et méthodes
startupsRouteur.get('/', (req, res) => {
  res.json({message: 'Page startups'});
});

startupsRouteur.get('/:id', (req, res) => {
  // Enregistre l'id dans la variable id
  const id = req.params.id;
  res.json({startupID: id});
});

// Export du routeur
export default startupsRouteur;

