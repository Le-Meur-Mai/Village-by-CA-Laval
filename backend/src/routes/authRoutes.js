// Importe le package express
import express from 'express'

// Importation des controlleurs nécéssaires
import authCtrl from "../controllers/authCtrl.js";
import userCtrl from '../controllers/userCtrl.js';
import startupsCtrl from '../controllers/startupsCtrl.js';
import quoteCtrl from '../controllers/quoteCtrl.js';
// Importation des middlewares nécéssaires
import authorizationConnexion from "../middlewares/authorizationConnexion.js";
import upload from "../middlewares/multer.js";
/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const authRouteur = express.Router();

// Définitions des différentes routes et méthodes
authRouteur.post('/login', authCtrl.login);

authRouteur.get('/profil', authorizationConnexion, authCtrl.getProfile);

authRouteur.patch('/profil', authorizationConnexion, userCtrl.updateUser);

authRouteur.patch('/profil/startup/:id', authorizationConnexion, upload.fields([
  {name: 'logo', maxCount: 1}, {name: 'descriptionPicture', maxCount: 1}]),
  startupsCtrl.updateStartUp);

authRouteur.post('/profil', authorizationConnexion, quoteCtrl.createQuote);

authRouteur.get('profil/quotes/:id', authorizationConnexion, quoteCtrl.getQuoteById);

authRouteur.patch('/profil/quotes/:id', authorizationConnexion, quoteCtrl.updateQuote);

authRouteur.delete('/profil/quotes/:id', authorizationConnexion, quoteCtrl.deleteQuote);

// Export du routeur
export default authRouteur;
