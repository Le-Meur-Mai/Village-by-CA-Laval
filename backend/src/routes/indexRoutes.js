// Importe le package express
import express from 'express'
// Importe les controlleurs associés à cette route
import indexCtrl from '../controllers/indexCtrl.js'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const indexRouteur = express.Router();

// Définitions des différentes routes et méthodes
indexRouteur.get('/', indexCtrl.getIndex);

// Export du routeur
export default indexRouteur;
