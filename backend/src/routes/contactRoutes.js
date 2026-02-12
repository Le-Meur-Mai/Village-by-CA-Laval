// Importe le package express
import express from 'express'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const contactRouteur = express.Router();

// Définitions des différentes routes et méthodes
contactRouteur.post('/', (req, res) => {
  res.json({message: 'Page contact'});
});

// Export du routeur
export default contactRouteur;
