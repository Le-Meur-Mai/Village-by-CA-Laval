import { v2 as cloudinary } from 'cloudinary';

// On configure Cloudinary pour que nos images puissent savoir où aller et pour pouvoir les modifier
// On utilise process.env pour aller chercher les clés dans notre environnement car on ne doit pas les push sur github

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // Le nom de notre serveur
  api_key: process.env.CLOUDINARY_API_KEY,
  // La clé publique de cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET 
  // La clé pour accéder à notre seveur c'est notre mot de passe
});

export default cloudinary;