import express from 'express'
// Importe les controlleurs associés à cette route
import postCtrl from '../controllers/contactCtrl.js'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const agendaRouteur = express.Router();

agendaRouteur.get('/', postCtrl.getAllPosts);

// Exportation du routeur
export default agendaRouteur;
