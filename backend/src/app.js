// Importe le package express
import express from 'express';
// On importe notre routeur pour l'endpoint Stuff dans la variable stuffRoute
// import userRoutes from './routes/userRoutes.js';

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

// On assigne l'endpoint Stuff au routeur stuffRoute
// app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.json({message: 'Le site marche ! YOUPI !!!'});
});

// On exporte notre app
export default app;
