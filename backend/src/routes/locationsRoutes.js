// Importe le package express
import express from 'express'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const locationsRouteur = express.Router();

// Définitions des différentes routes et méthodes
locationsRouteur.get('/', (req, res) => {
  res.json({message: 'Page locations'});
});

locationsRouteur.get('/:id', (req, res) => {
  // Enregistre l'id dans la variable id
  const id = req.params.id;
  res.json({locationID: id});
});

// Export du routeur
export default locationsRouteur;

