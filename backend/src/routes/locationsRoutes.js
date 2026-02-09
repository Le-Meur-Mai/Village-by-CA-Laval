// Importe le package express
import express from 'express'
// Importe les controlleurs associés à cette route
import locationsCtrl from '../controllers/locationsCtrl.js'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const locationsRouteur = express.Router();

// Définitions des différentes routes et méthodes
locationsRouteur.get('/', locationsCtrl.getAllLocations);

locationsRouteur.get('/:id', locationsCtrl.getLocationByID);

// Export du routeur
export default locationsRouteur;
