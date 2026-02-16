// Importe le package express
import express from 'express'

/*
Créer un router avec le module express.Router, permet de définir les routes
dans des fichiers séparés
*/
const authRouteur = express.Router();

// Définitions des différentes routes et méthodes
authRouteur.get('/login', (req, res) => {
  res.json({message: 'Page login'});
});

authRouteur.get('/profil', (req, res) => {
  res.json({message: 'Page profil'});
});

authRouteur.patch('/profil/update', (req, res) => {
  // if (verifiaction admin || vérification user = jwt actif)
  res.json({message: 'Mise à jour du profil'});
});

authRouteur.get('/profil/:id', (req, res) => {
  res.json({message: 'Détail de la quote du user'});
});

authRouteur.post('/profil', (req, res) => {
  // if (verifiaction admin || vérification user = jwt actif)
  res.json({message: 'Création de nouvelle quote'});
});

authRouteur.patch('/profil/:id', (req, res) => {
  // if (verifiaction admin || vérification user = jwt actif)
  res.json({message: 'Modification de la quote du user'});
});

authRouteur.delete('/profil/:id', (req, res) => {
  // if (verifiaction admin || vérification user = jwt actif)
  res.json({message: 'Suppression de la quote du user'});
});

// Export du routeur
export default authRouteur;