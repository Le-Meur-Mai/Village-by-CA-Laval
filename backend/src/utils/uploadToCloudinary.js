import cloudinary from "../../config/cloudinary.js";
/* Fonction utilitaire pour upload des images dans cloudinary,
pour éviter la duplication de code. Et alléger les services */

export default function uploadPictureToCloudinary(file, folder) {
  // On fait une promesse à l'ancienne car Cloudinary ne supporte pas le format async, await.
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {folder},
      /* Fonction de callback node.js, S'il y a une erreur la promesse échoue 
      sinon elle renvoie le résultat qui renvoie un objet cloudinary*/
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    /*Sert à envoyer l'image dans le flux Cloudinary donné par upload_stream
    (il renvoie un stream d'écriture, et tuyau où envoyer des données) et
    dire qu'il a finit d'envoyer des données*/
    upload.end(file.buffer);
  });
}
