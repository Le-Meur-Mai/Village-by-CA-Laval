// Importe le package express
import express from 'express'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const partnersRouteur = express.Router();

// Définitions des différentes routes et méthodes
partnersRouteur.get('/', (req, res) => {
  res.json({message: 'Page partenaires'});
});

partnersRouteur.get('/:id', (req, res) => {
  // Enregistre l'id dans la variable id
  const id = req.params.id;
  res.json({partenaireID: id});
});

// Export du routeur
export default partnersRouteur;

