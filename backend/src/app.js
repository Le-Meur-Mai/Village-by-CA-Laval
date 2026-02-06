// Importe le package express
import express from 'express';
// On importe nos routeurs pour les différents endpoints dans des variables
import indexRoutes from './routes/indexRoutes.js';
import partnersRoutes from './routes/partnersRoutes.js';
import startupsRoutes from './routes/startupsRoutes.js';
import locationsRoutes from './routes/locationsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Lance la méthode express pour créer une application
const app = express();

/*
Middleware qui prend toutes les requêtes ayant comme Content-type Application/JSON
et rend leur body utilisable directement sur l'objet req
*/
app.use(express.json());

/* 
Spécification des headers pour permettre de communiquer entre différents serveurs
et éviter les erreurs CORS. Ils permettent :
- d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
- d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
- d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// On assigne les différents endpoints à nos routeurs
app.use('/', indexRoutes);
app.use('/partenaires', partnersRoutes);
app.use('/startups', startupsRoutes);
app.use('/locations', locationsRoutes);
app.use('/contact', contactRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// On exporte notre app
export default app;
