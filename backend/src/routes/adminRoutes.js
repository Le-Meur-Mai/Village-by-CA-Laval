// Importe le package express
import express from 'express'

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
adminRouteur.get('/users', (req, res) => {
  res.json({message: 'Page admin - users'});
});

adminRouteur.post('/users', (req, res) => {
  res.json({message: 'Page admin - users'});
});

adminRouteur.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminUserID: id});
});

adminRouteur.patch('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminUserID: id});
});

adminRouteur.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminUserID: id});
});

// --- STARTUPS --- //
adminRouteur.get('/startups', (req, res) => {
  res.json({message: 'Page admin - startups'});
});

adminRouteur.post('/startups', (req, res) => {
  res.json({message: 'Page admin - startups'});
});

adminRouteur.get('/startups/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminStartupID: id});
});

adminRouteur.patch('/startups/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminStartupID: id});
});

adminRouteur.delete('/startups/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminStartupID: id});
});

// --- PARTNERS --- //
adminRouteur.get('/partenaires', (req, res) => {
  res.json({message: 'Page admin - partenaires'});
});

adminRouteur.post('/partenaires', (req, res) => {
  res.json({message: 'Page admin - partenaires'});
});

adminRouteur.get('/partenaires/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminPartenaireID: id});
});

adminRouteur.patch('/partenaires/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminPartenaireID: id});
});

adminRouteur.delete('/partenaires/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminPartenaireID: id});
});

// --- QUOTES --- //
adminRouteur.get('/citations', (req, res) => {
  res.json({message: 'Page admin - citations'});
});

adminRouteur.get('/citations/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminCitationID: id});
});

adminRouteur.delete('/citations/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminCitationID: id});
});

// --- EVENTS --- //
adminRouteur.get('/evenements', (req, res) => {
  res.json({message: 'Page admin - evenements'});
});

adminRouteur.post('/evenements', (req, res) => {
  res.json({message: 'Page admin - evenements'});
});

adminRouteur.get('/evenements/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminEvenementID: id});
});

adminRouteur.patch('/evenements/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminEvenementID: id});
});

adminRouteur.delete('/evenements/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminEvenementID: id});
});

// --- POSTS --- //
adminRouteur.get('/articles', (req, res) => {
  res.json({message: 'Page admin - articles'});
});

adminRouteur.post('/articles', (req, res) => {
  res.json({message: 'Page admin - articles'});
});

adminRouteur.get('/articles/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminArticleID: id});
});

adminRouteur.patch('/articles/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminArticleID: id});
});

adminRouteur.delete('/articles/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminArticleID: id});
});

// --- LOCATIONS --- //
adminRouteur.get('/locations', (req, res) => {
  res.json({message: 'Page admin - locations'});
});

adminRouteur.post('/locations', (req, res) => {
  res.json({message: 'Page admin - locations'});
});

adminRouteur.get('/locations/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminLocationID: id});
});

adminRouteur.patch('/locations/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminLocationID: id});
});

adminRouteur.delete('/locations/:id', (req, res) => {
  const id = req.params.id;
  res.json({adminLocationID: id});
});

// Export du routeur
export default adminRouteur;

