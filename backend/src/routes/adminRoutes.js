// Importe le package express
import express from 'express';
// Importation du middleware Multer pour gérer les fichiers
import upload from "../middlewares/multer.js";
// Importe les controllers utilisé dans la route admin
import userCtrl from '../controllers/userCtrl.js';
import startUpsCtrl from '../controllers/startupsCtrl.js';
import partnerCtrl from '../controllers/partnersCtrl.js';
import quoteCtrl from '../controllers/quoteCtrl.js';
import eventCtrl from '../controllers/eventCtrl.js';
import postCtrl from '../controllers/postCtrl.js';
import locationCtrl from '../controllers/locationsCtrl.js';
import typeCtrl from '../controllers/typeCtrl.js';
// Importation des middlewares pour vérifier les tokens
import authorizationAdmin from '../middlewares/authorizationAdmin.js';
import authorizationConnexion from '../middlewares/authorizationConnexion.js';

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const adminRouteur = express.Router();

// Définitions des différentes routes et méthodes
// --- USERS --- //

adminRouteur.post('/users', userCtrl.createUser);

adminRouteur.get('/users/:id', authorizationConnexion, authorizationAdmin, userCtrl.getUserById);

adminRouteur.get('/users', authorizationConnexion, authorizationAdmin, userCtrl.getAllUsers);

adminRouteur.patch('/users/:id', authorizationConnexion, authorizationAdmin, userCtrl.updateUser);

adminRouteur.delete('/users/:id', authorizationConnexion, authorizationAdmin, userCtrl.deleteUser);

// --- STARTUPS --- //

// On dit à notre middleware upload d'avoir deux files pictures dans req.files
adminRouteur.post('/startups', authorizationConnexion, authorizationAdmin,
  upload.fields([{name: 'logo', maxCount: 1}, {name: 'descriptionPicture', maxCount: 1}]),
  startUpsCtrl.createStartUp);

adminRouteur.get('/startups/:id', authorizationConnexion, authorizationAdmin, startUpsCtrl.getStartUpById);

adminRouteur.get('/startups', authorizationConnexion, authorizationAdmin, startUpsCtrl.getAllStartUps);

adminRouteur.patch('/startups/:id', authorizationConnexion, authorizationAdmin, upload.fields([
  {name: 'logo', maxCount: 1}, {name: 'descriptionPicture', maxCount: 1}]),
  startUpsCtrl.updateStartUp);

adminRouteur.delete('/startups/:id', authorizationConnexion, authorizationAdmin, startUpsCtrl.deleteStartUp);

// --- PARTNERS --- //

adminRouteur.post('/partenaires', authorizationConnexion, authorizationAdmin, upload.single('logo'), partnerCtrl.createPartner);

adminRouteur.get('/partenaires/:id', authorizationConnexion, authorizationAdmin, partnerCtrl.getPartnerById);

adminRouteur.get('/partenaires', authorizationConnexion, authorizationAdmin, partnerCtrl.getAllPartners);

adminRouteur.patch('/partenaires/:id', authorizationConnexion, authorizationAdmin, upload.single('logo'), partnerCtrl.updatePartner);

adminRouteur.delete('/partenaires/:id', authorizationConnexion, authorizationAdmin, partnerCtrl.deletePartner);

// --- QUOTES --- //

adminRouteur.post('/citations', authorizationConnexion, authorizationAdmin, quoteCtrl.createQuote);

adminRouteur.get('/citations/:id', authorizationConnexion, authorizationAdmin, quoteCtrl.getQuoteById);

adminRouteur.get('/citations', authorizationConnexion, authorizationAdmin, quoteCtrl.getAllQuotes);

adminRouteur.patch('/citations/:id', authorizationConnexion, authorizationAdmin, quoteCtrl.updateQuote);

adminRouteur.delete('/citations/:id', authorizationConnexion, authorizationAdmin, quoteCtrl.deleteQuote);

// --- EVENTS --- //

adminRouteur.post('/evenements', authorizationConnexion, authorizationAdmin, eventCtrl.createEvent);

adminRouteur.get('/evenements/:id', authorizationConnexion, authorizationAdmin, eventCtrl.getEventById);

adminRouteur.get('/evenements', authorizationConnexion, authorizationAdmin, eventCtrl.getAllEvents);

adminRouteur.patch('/evenements/:id', authorizationConnexion, authorizationAdmin, eventCtrl.updateEvent);

adminRouteur.delete('/evenements/:id', authorizationConnexion, authorizationAdmin, eventCtrl.deleteEvent);

// --- POSTS --- //

adminRouteur.post('/articles', authorizationConnexion, authorizationAdmin, upload.single('picture'), postCtrl.createPost);

adminRouteur.get('/articles/:id', authorizationConnexion, authorizationAdmin, postCtrl.getPostById);

adminRouteur.get('/articles', authorizationConnexion, authorizationAdmin, postCtrl.getAllPosts);

adminRouteur.patch('/articles/:id', authorizationConnexion, authorizationAdmin, upload.single('picture'), postCtrl.updatePost);

adminRouteur.delete('/articles/:id', authorizationConnexion, authorizationAdmin, postCtrl.deletePost);

// --- LOCATIONS --- //

// Multer va chercher le champs pictures avec plusieurs fichiers que l'on met dans req.files
adminRouteur.post('/locations', authorizationConnexion, authorizationAdmin, upload.array('pictures', 5), locationCtrl.createLocation);

adminRouteur.get('/locations/:id', authorizationConnexion, authorizationAdmin, locationCtrl.getLocationById);

adminRouteur.get('/locations', authorizationConnexion, authorizationAdmin, locationCtrl.getAllLocations);

adminRouteur.patch('/locations/:id', authorizationConnexion, authorizationAdmin, upload.array('newPictures', 5), locationCtrl.updateLocation);

adminRouteur.delete('/locations/:id', authorizationConnexion, authorizationAdmin, locationCtrl.deleteLocation);

// --- TYPES --- //

adminRouteur.post('/types', authorizationConnexion, authorizationAdmin, typeCtrl.createType);

adminRouteur.get('/types/:id', authorizationConnexion, authorizationAdmin, typeCtrl.getTypeById);

adminRouteur.get('/types', authorizationConnexion, authorizationAdmin, typeCtrl.getAllTypes);

adminRouteur.patch('/types/:id', authorizationConnexion, authorizationAdmin, typeCtrl.updateType);

adminRouteur.delete('/types/:id', authorizationConnexion, authorizationAdmin, typeCtrl.deleteType);

// Export du routeur
export default adminRouteur;
