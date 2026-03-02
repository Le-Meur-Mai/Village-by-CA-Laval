import multer from "multer";
/* Middleware utilisant multer. Multer est un middleware Express qui va
intercepter et gérer les uploads de fichiers via des formulaires : 
multipart/form-data -> fomrat spécial utilisé dans les requête HTTP
et dans Postman pour envoyer des fichiers.*/

/*Pour stocker le fichier uploadé dans la mémoire vive temporairement dans
un buffer. Le fichier est accessible depuis req.file.buffer*/
const storage = multer.memoryStorage();

// Instance d'un multer qu'on configure ci-dessous, pour l'utiliser partout
const upload = multer({
  storage, // Là où on stocke le fichier avant de l'envoyer à Cloudinary
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  }
});

export default upload;
