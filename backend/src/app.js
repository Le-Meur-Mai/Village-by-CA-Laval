// Importe le package express
import express from 'express';
// On importe nos routeurs pour les différents endpoints dans des variables
import indexRoutes from './routes/indexRoutes.js';
import partnersRoutes from './routes/partnersRoutes.js';
import startupsRoutes from './routes/startupsRoutes.js';
import agendaRoutes from './routes/agendaRoutes.js';
import locationsRoutes from './routes/locationsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// On importe cookie parser qui va permettre à express de lire et réceptionner les cookies
import cookieParser from "cookie-parser";
// Import CORS pour gérer les erreurs cross-serveur
import cors from "cors";

// Importe le Error handler qui va gérer les erreurs reçue par les routes
import errorHandler from './errors/errorHandler.js'

// Lance la méthode express pour créer une application
const app = express();

/*
Middleware qui prend toutes les requêtes ayant comme Content-type Application/JSON
et rend leur body utilisable directement sur l'objet req. On rajoute le url encoded
de Express pour lire les formulaires notamment avec les file pour avoir des objets
js utilisables. CookieParser sert à lire le cookie dans lequel se trouve le JWT
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Gère les requêtes cross-origin entre plusieurs serveurs et les erreurs CORS
app.use(cors({
    origin: "http://localhost:5173", // le serveur frontend
    credentials: true // Pour que le navigateur accepte les cookies cross-origin
}));

// On assigne les différents endpoints à nos routeurs
app.use('/', indexRoutes);
app.use('/partenaires', partnersRoutes);
app.use('/startups', startupsRoutes);
app.use('/agenda', agendaRoutes);
app.use('/locations', locationsRoutes);
app.use('/contact', contactRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

// On exporte notre app
export default app;
