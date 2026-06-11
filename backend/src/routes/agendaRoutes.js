import express from 'express'
// Importe les controlleurs associés à cette route
import agendaCtrl from '../controllers/agendaCtrl.js';
import postCtrl from '../controllers/postCtrl.js';
import eventCtrl from '../controllers/eventCtrl.js';

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const agendaRouteur = express.Router();

agendaRouteur.get('/', agendaCtrl.getAgenda);
agendaRouteur.get('/:id', postCtrl.getPostById);
agendaRouteur.get('/event/:id', eventCtrl.getEventById);

// Exportation du routeur
export default agendaRouteur;
