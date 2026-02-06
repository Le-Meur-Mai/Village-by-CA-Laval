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

authRouteur.get('/profil/update', (req, res) => {
  res.json({message: 'Mise à jour du profil'});
});

authRouteur.get('/profil/:id', (req, res) => {
  res.json({message: 'Détail de la quote du user'});
});

authRouteur.patch('/profil/:id', (req, res) => {
  res.json({message: 'Modification de la quote du user'});
});

authRouteur.delete('/profil/:id', (req, res) => {
  res.json({message: 'Suppression de la quote du user'});
});

// Export du routeur
export default authRouteur;

