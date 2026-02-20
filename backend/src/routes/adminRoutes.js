// Importe le package express
import express from 'express'
// Importe les controllers utilisé dans la route admin
import userCtrl from '../controllers/userCtrl.js'
import startUpsCtrl from '../controllers/startupsCtrl.js'
import partnerCtrl from '../controllers/partnersCtrl.js'
import quoteCtrl from '../controllers/quoteCtrl.js'
import eventCtrl from '../controllers/eventCtrl.js'
import postCtrl from '../controllers/postCtrl.js'
import locationCtrl from '../controllers/locationsCtrl.js'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const adminRouteur = express.Router();

// Définitions des différentes routes et méthodes
adminRouteur.get('/', (req, res) => {
  res.json({message: 'Page admin'});
});

// --- USERS --- //
adminRouteur.get('/users', userCtrl.getAllUsers);

adminRouteur.post('/users', userCtrl.createUser);

adminRouteur.get('/users/:id', userCtrl.getUserById);

adminRouteur.patch('/users/:id', userCtrl.updateUser);

adminRouteur.delete('/users/:id', userCtrl.deleteUser);

// --- STARTUPS --- //
adminRouteur.get('/startups', startUpsCtrl.getAllStartups);

adminRouteur.post('/startups', startUpsCtrl.createStartUp);

adminRouteur.get('/startups/:id', startUpsCtrl.getStartupById);

adminRouteur.patch('/startups/:id', startUpsCtrl.updateStartUp);

adminRouteur.delete('/startups/:id', startUpsCtrl.deleteStartUp);

// --- PARTNERS --- //
adminRouteur.get('/partenaires', partnerCtrl.getAllPartners);

adminRouteur.post('/partenaires', partnerCtrl.createPartner);

adminRouteur.get('/partenaires/:id', partnerCtrl.getPartnerByID);

adminRouteur.patch('/partenaires/:id', partnerCtrl.updatePartner);

adminRouteur.delete('/partenaires/:id', partnerCtrl.deletePartner);

// --- QUOTES --- //
adminRouteur.get('/citations', quoteCtrl.getAllQuotes);

adminRouteur.post('/citations', quoteCtrl.createQuote);

adminRouteur.get('/citations/:id', quoteCtrl.getQuoteById);

adminRouteur.patch('/citations/:id', quoteCtrl.updateQuote);

adminRouteur.delete('/citations/:id', quoteCtrl.deleteQuote);

// --- EVENTS --- //
adminRouteur.get('/evenements', eventCtrl.getAllEvents);

adminRouteur.post('/evenements', eventCtrl.createEvent);

adminRouteur.get('/evenements/:id', eventCtrl.getEventById);

adminRouteur.patch('/evenements/:id', eventCtrl.updateEvent);

adminRouteur.delete('/evenements/:id', eventCtrl.deleteEvent);

// --- POSTS --- //
adminRouteur.get('/articles', postCtrl.getAllPosts);

adminRouteur.post('/articles', postCtrl.createPost);

adminRouteur.get('/articles/:id', postCtrl.getPostById);

adminRouteur.patch('/articles/:id', postCtrl.updatePost);

adminRouteur.delete('/articles/:id', postCtrl.deletePost);

// --- LOCATIONS --- //
adminRouteur.get('/locations', locationCtrl.getAllLocations);

adminRouteur.post('/locations', locationCtrl.createLocation);

adminRouteur.get('/locations/:id', locationCtrl.getLocationById);

adminRouteur.patch('/locations/:id', locationCtrl.updateLocation);

adminRouteur.delete('/locations/:id', locationCtrl.deleteLocation);

// Export du routeur
export default adminRouteur;
