// Importe le package express
import express from 'express'
// Importe les controlleurs associés à cette route
import startupsCtrl from '../controllers/startupsCtrl.js'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const startupsRouteur = express.Router();

// Définitions des différentes routes et méthodes
startupsRouteur.get('/', startupsCtrl.getAllStartups);

startupsRouteur.get('/:id', startupsCtrl.getStartupById);

// Export du routeur
export default startupsRouteur;
