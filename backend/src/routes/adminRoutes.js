// Importe le package express
import express from 'express';
// Importe les controllers utilisé dans la route admin
import userCtrl from '../controllers/userCtrl.js';
import startUpsCtrl from '../controllers/startupsCtrl.js';
import partnerCtrl from '../controllers/partnersCtrl.js';
import quoteCtrl from '../controllers/quoteCtrl.js';
import eventCtrl from '../controllers/eventCtrl.js';
import postCtrl from '../controllers/postCtrl.js';
import locationCtrl from '../controllers/locationsCtrl.js';
import typeCtrl from '../controllers/typeCtrl.js';

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const adminRouteur = express.Router();

// Définitions des différentes routes et méthodes
// --- USERS --- //

adminRouteur.post('/users', userCtrl.createUser);

adminRouteur.get('/users/:id', userCtrl.getUserById);

adminRouteur.get('/users', userCtrl.getAllUsers);

adminRouteur.patch('/users/:id', userCtrl.updateUser);

adminRouteur.delete('/users/:id', userCtrl.deleteUser);

// --- STARTUPS --- //

adminRouteur.post('/startups', startUpsCtrl.createStartUp);

adminRouteur.get('/startups/:id', startUpsCtrl.getStartUpById);

adminRouteur.get('/startups', startUpsCtrl.getAllStartUps);

adminRouteur.patch('/startups/:id', startUpsCtrl.updateStartUp);

adminRouteur.delete('/startups/:id', startUpsCtrl.deleteStartUp);

// --- PARTNERS --- //

adminRouteur.post('/partenaires', partnerCtrl.createPartner);

adminRouteur.get('/partenaires/:id', partnerCtrl.getPartnerById);

adminRouteur.get('/partenaires', partnerCtrl.getAllPartners);

adminRouteur.patch('/partenaires/:id', partnerCtrl.updatePartner);

adminRouteur.delete('/partenaires/:id', partnerCtrl.deletePartner);

// --- QUOTES --- //

adminRouteur.post('/citations', quoteCtrl.createQuote);

adminRouteur.get('/citations/:id', quoteCtrl.getQuoteById);

adminRouteur.get('/citations', quoteCtrl.getAllQuotes);

adminRouteur.patch('/citations/:id', quoteCtrl.updateQuote);

adminRouteur.delete('/citations/:id', quoteCtrl.deleteQuote);

// --- EVENTS --- //

adminRouteur.post('/evenements', eventCtrl.createEvent);

adminRouteur.get('/evenements/:id', eventCtrl.getEventById);

adminRouteur.get('/evenements', eventCtrl.getAllEvents);

adminRouteur.patch('/evenements/:id', eventCtrl.updateEvent);

adminRouteur.delete('/evenements/:id', eventCtrl.deleteEvent);

// --- POSTS --- //

adminRouteur.post('/articles', postCtrl.createPost);

adminRouteur.get('/articles/:id', postCtrl.getPostById);

adminRouteur.get('/articles', postCtrl.getAllPosts);

adminRouteur.patch('/articles/:id', postCtrl.updatePost);

adminRouteur.delete('/articles/:id', postCtrl.deletePost);

// --- LOCATIONS --- //

adminRouteur.post('/locations', locationCtrl.createLocation);

adminRouteur.get('/locations/:id', locationCtrl.getLocationById);

adminRouteur.get('/locations', locationCtrl.getAllLocations);

adminRouteur.patch('/locations/:id', locationCtrl.updateLocation);

adminRouteur.delete('/locations/:id', locationCtrl.deleteLocation);

// --- TYPES --- //

adminRouteur.post('/types', typeCtrl.createType);

adminRouteur.get('/types/:id', typeCtrl.getTypeById);

adminRouteur.get('/types', typeCtrl.getAllTypes);

adminRouteur.patch('/types/:id', typeCtrl.updateType);

adminRouteur.delete('/types/:id', typeCtrl.deleteType);

// Export du routeur
export default adminRouteur;
