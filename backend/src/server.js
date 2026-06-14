// Importe le package http natif de node pour gérer les requêtes http
import http from 'http';
// Importe l'application du fichier app, qu'on va créer après
import app from './app.js';
// Import Prisma pour initialiser la table Config
import { PrismaClient } from '@prisma/client';

/* Importe la fonction cron qui va nettoyer automatiquement
les évenements tous les mois */
import "../cron/cleanupEvents.cron.js";


/* 
Défini un port d'écoute
process.env.PORT prend le port d'écoute envoyé par l'environnement, sinon prend
le port 3000 par défaut
*/
const port = process.env.PORT || 3000;

// Spécifie de port d'écoute pour l'application
app.set('port', port);

const prisma = new PrismaClient();

async function init() {
  // 1. Charger la config
  const config = await prisma.config.findUnique({ where: { id: 1 } });

  if (!config) {
    console.error("ERREUR : aucune config trouvée dans la base !");
    process.exit(1);
  }

  // 2. Stocker dans global
  global.DEFAULT_LOGO_ID = config.defaultLogoId;
  global.DEFAULT_DESC_ID = config.defaultDescId;

  console.log("Images par défaut chargées");

    /* 
  Crée un serveur avec la méthode du module http
  Il prend comme argument notre app, qui va gérer les requêtes et les 
  réponses http
  */
  const server = http.createServer(app);

  // Spécifie le port d'écoute du serveur et affiche un message dans la console
  server.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
  });
}

init();
