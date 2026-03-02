// Import du Repo pour communiquer avec la database
import LocationRepository from "../repositories/LocationRepository.js";
// Import du Repo Picture pour créer les images dans la base de données
import PictureRepository from "../repositories/PictureRepository.js"
//Import de la classe pour vérifier la conformité des données
import Location from "../classes/Location.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"
// Import de la fonction cloudinary pour envoyer les images sur l'hébergeur
import uploadPictureToCloudinary from "../utils/uploadToCloudinary.js";
// Importation de la config Cloudinary pour pouvoir supprimer des images
import cloudinary from "../../config/cloudinary.js";

export default class LocationServices{
  constructor() {
    // Création d'une instance pour utiliser les méthodes de la classe repo
    this.locationRepo = new LocationRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  // POST Création d'une location
  async createLocation(data) {
    let uploadPictures = [];
    let createdPictures = [];
    try {
      /* 
      Création d'une transaction Prisma : si une transaction échoue, les autres
      s'annulent 
      */
      return await prisma.$transaction(async (tx) => {
        if(!data.pictures || data.pictures.length < 1 || data.pictures.length > 5) {
          throw new Errors.ValidationError('You must have between 1 and 5 pictures');
        } else {
          // Pour chaque image dans data.pictures, on crée une nouvelle image
          for (const pictureMulter of data.pictures) {
            // Upload Cloudinary
            const upload = await uploadPictureToCloudinary(pictureMulter, "Locations");

            uploadPictures.push(upload); // pour rollback

            // Création des images dans la DB
            const picture = await this.pictureRepo.createPicture({
              secureUrl: upload.secure_url,
              publicId: upload.public_id
            }, tx);

            createdPictures.push(picture.id);
          }
          // On remplace le tableau des pictures en base64 par le tableau d'objet picture
          data.pictures = createdPictures;
          // Crée une nouvelle instance pour vérifier la conformité des données
          new Location(data);
          return await this.locationRepo.createLocation(data, tx);
        }
      })
    } catch (error) {
      if (uploadPictures.length > 0) {
        for (const orphanPictureCloud of uploadPictures) {
          await cloudinary.uploader.destroy(orphanPictureCloud.public_id);
        }
      }
      throw error;
    }
  }

  // GET Retourne une location suivant son id
  async getLocationById(id) {
    try {
      const location = await this.locationRepo.getLocationById(id);
      if(!location) {
        throw new Errors.NotFoundError('Location not found');
      }
      return location;
    } catch (error) {
      throw error;
    }
  }

  // Get retourne toutes les locations existantes
  async getAllLocations() {
    try {
      return await this.locationRepo.getAllLocations();
    } catch (error) {
      throw error;
    }
  }

  // PATCH Update une location
  async updateLocation(id, data) {

    // Tableau d'image créée dans Cloudinary
    let newCloudinaryPictures = [];
    // Tableau d'objet picture qui seront créées en DB
    let createdDBPictures = [];

    try {
      /*On fait les vérification avant les images Cloudinary, car elles mettent
      du temps à upload et il faut les faire hors transaction, car sinon
      la transaction va crash puisque ça va mettre trop de temps.*/

      // On vérifie que la location existe

      const existingLocation = await this.locationRepo.getLocationById(id);
      if(!existingLocation) {
        throw new Errors.NotFoundError('Location not found');
      }
      
      // On vérifie le nombre d'images, s'il n'y a pas de tableau on met 0 par défaut
      const total = (data.pictures?.length || 0) + (data.newPictures?.length || 0);

      if (total > 5 || total < 1) {
        throw new Errors.ValidationError(
          "You have to had between 1 and 5 pictures")
      }
      const oldPictures = existingLocation.pictures;

      // On vérifie que les id passés dans Pictures sont bien des images
      if (data.pictures) {
        for (const id of data.pictures) {
          const existingPicture = await this.pictureRepo.getPictureById(id);
          if(!existingPicture) {
            throw new Errors.NotFoundError("One of the picture doesn't exist.");
          }
        }
      }

      // On crée les nouvelles images dans cloudinary
      if (data.newPictures) {
        for (const uploadPicture of data.newPictures) {
          const newPicture = await uploadPictureToCloudinary(uploadPicture, "Locations");
          newCloudinaryPictures.push({
            secureUrl: newPicture.secure_url,
            publicId: newPicture.public_id
          });
        }
      }
      // Là on commence la transaction
      return await prisma.$transaction(async (tx) => {

        if (newCloudinaryPictures) {
          // Crée les nouvelles images avec Promise.all qui va lancer les promesses en parallèle
          // Création des nouvelles images dans la DB
          createdDBPictures = await Promise.all(
            newCloudinaryPictures.map(picture => {
              return this.pictureRepo.createPicture(picture, tx);
            })
          )
          
          // Au cas où ce n'est pas un tableau sinon push va crash
          data.pictures = data.pictures || [];
          /*On Push les id des nouvelles images dans notre liste d'Id,
          on utilise spread car le .map renvoie un tableau et on veut pas push
          le tableau mais tous les ids contenus dans le tableau renvoyé.
          On va push chaque élément séparément et pas en un seul bloc*/
          data.pictures.push(...createdDBPictures.map(picture => picture.id));
        }

        delete data.newPictures;

        
        // On fusionne les anciennes données avec les nouvelles
        const newLocation = {...existingLocation, ...data};
        new Location(newLocation);
        
        const updatedLocation = await this.locationRepo.updateLocation(id, data, tx);
        /* 
        On filtre les anciennes images. Pour chaque ancienne image on
        compare avec data.pictures les Id de l'un et de l'autre pour voir
        si c'est les mêmes.
        Si ce n'est pas les mêmes (condition: !data.pictures), l'image
        d'oldPicture va être mis dans le tableau retourné par filter.
        Ce tableau va être parcouru avec le .map et va delete toutes les
        anciennes images qui n'auront pas été gardées.
        */
      
        await Promise.all(
          oldPictures
            .filter(oldPic => !data.pictures.includes(oldPic.id))
            .map(async picture => {
              await cloudinary.uploader.destroy(picture.publicId);
              await this.pictureRepo.deletePicture(picture.id, tx);
            })
        );

        return updatedLocation;
      })
    } catch (error) {
      // On supprime les nouvelles images créées dans Cloudinary
      if (newCloudinaryPictures.length > 0) {
        for (const picture of newCloudinaryPictures) {
          await cloudinary.uploader.destroy(picture.publicId);
        }
      }
      throw error;
    }
  }

  // DELETE Supprime une location
  async deleteLocation(id) {
    try {
      const location = await this.locationRepo.getLocationById(id);
      if(!location) {
        throw new Errors.NotFoundError('Location not found');
      }
      /*On fait une copie des anciennes images. On utilise spread car sinon
      c'est une référence et pas une vraie copie*/
      const oldPicturesLocation = [...location.pictures];
      /* 
      Création d'une transaction Prisma : si une transaction échoue, les autres
      s'annulent 
      */
      const deletedLocation = await prisma.$transaction(async (tx) => {
        // Suppression de la location
        const oldLocation = await this.locationRepo.deleteLocation(id, tx);

        // Suppression des images dans la DB
        await Promise.all(
          oldPicturesLocation.map(picture => this.pictureRepo.deletePicture(picture.id, tx))
        );
        
        return oldLocation;
      });
      // Supression des images dans Cloudinary
      for (const cloudinaryPicture of oldPicturesLocation) {
        await cloudinary.uploader.destroy(cloudinaryPicture.publicId)
      }
      return deletedLocation;
    } catch (error) {
      throw error;
    }
  }
}
