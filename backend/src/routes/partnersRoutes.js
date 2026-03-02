// Importe le package express
import express from 'express'
// Importe les controlleurs associés à cette route
import partnersCtrl from '../controllers/partnersCtrl.js'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const partnersRouteur = express.Router();

// Définitions des différentes routes et méthodes
partnersRouteur.get('/', partnersCtrl.getAllPartners);

partnersRouteur.get('/:id', partnersCtrl.getPartnerById);

// Export du routeur
export default partnersRouteur;
