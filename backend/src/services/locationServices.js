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
          for (const picture64 of data.pictures) {
            // Upload Cloudinary
            const upload = await cloudinary.uploader.upload(picture64, {
              folder: "Locations"
            });

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
      if (createdPictures.length > 0) {
        for (const orphanPictureDB of createdPictures) {
          await this.pictureRepo.deletePicture(orphanPictureDB);
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
    let newPictures = [];
    // Tableau d'objet picture qui seront créées en DB
    let createdPictures = [];
    try {
      return await prisma.$transaction(async (tx) => {
        // Tableau final d'ID picture à passer à prisma
        let updatedPictures = [];
        // Tableau des images qui n'existaient pas de base en db
        let notExistingPictures = [];

        // On vérifie que la location existe

        const existingLocation = await this.locationRepo.getLocationById(id, tx);
        if(!existingLocation) {
          throw new Errors.NotFoundError('Location not found');
        }

        if (data.pictures.length > 5){
          throw new Errors.ValidationError(
            "You can't upload more that five pictures to the location.")
        }
        const oldPictures = existingLocation.pictures;

        // Trie les images existantes des nouvelles
        for (const picture of data.pictures) {
          const existingPicture = await this.pictureRepo.getPictureById(picture, tx);
          if(existingPicture) {
            /* Les images qui existent déjà car ID (en général les anciennes
            images de locations que l'on veut garder), on les met dans le
            tableau final de l'update*/
            updatedPictures.push(existingPicture.id);
          } else {
            // Les images qui n'existent pas encore que l'on va créer
            notExistingPictures.push(picture);
          }
        }

        // On crée les nouvelles images dans cloudinary
        for (const uploadPicture of notExistingPictures) {
          const newPicture = await cloudinary.uploader.upload(uploadPicture, {
            folder: "Locations"
          });
          newPictures.push({
            secureUrl: newPicture.secure_url,
            publicId: newPicture.public_id
          });
        }
        
        // Crée les nouvelles images avec Promise.all qui va lancer les promesses en parallèle
        // Création des nouvelles images dans la DB
        createdPictures = await Promise.all(
          newPictures.map(picture => {
            return this.pictureRepo.createPicture(picture, tx);
          })
        )
        
        // On Push les id des nouvelles images dans notre liste d'Id
        updatedPictures.push(...createdPictures.map(picture => picture.id));
        data.pictures = updatedPictures;
        
        // On remplace les anciennes données par les nouvelles
        const newLocation = {...existingLocation, ...data};
        new Location(newLocation);
        
        const ReturnedLocation = await this.locationRepo.updateLocation(id, data, tx);
        /* 
        On filtre les anciennes images. Pour chaque ancienne image on
        compare avec updatedPictures les Id de l'un et de l'autre pour voir
        si c'est les mêmes.
        Si ce n'est pas les mêmes (condition: !updatedPictures), l'image
        d'oldPicture va être mis dans le tableau retourné par filter.
        Ce tableau va être parcouru avec le .map et va delete toutes les
        anciennes images qui n'auront pas été gardées.
        */
      
        await Promise.all(
          oldPictures
            .filter(oldPic => !updatedPictures.includes(oldPic.id))
            .map(async picture => {
              await cloudinary.uploader.destroy(picture.publicId);
              await this.pictureRepo.deletePicture(picture.id, tx);
            })
        );

        return ReturnedLocation;
      })
    } catch (error) {
      // On supprime les nouvelles images créées dans Cloudinary
      if (newPictures.length > 0) {
        for (const picture of newPictures) {
          await cloudinary.uploader.destroy(picture.publicId);
        }
      }

      // On supprime les nouvelles images de la DB
      if (createdPictures.length > 0) {
        await Promise.all(createdPictures.map(async picture => {
          await this.pictureRepo.deletePicture(picture.id)}));
      }
      throw error;
    }
  }

  // DELETE Supprime une location
  async deleteLocation(id) {
    try {
      /* 
      Création d'une transaction Prisma : si une transaction échoue, les autres
      s'annulent 
      */
      return await prisma.$transaction(async (tx) => {
        const location = await this.locationRepo.getLocationById(id, tx);
        if(!location) {
          throw new Errors.NotFoundError('Location not found');
        }
        // Suppression des images dans la DB
        await Promise.all(
          location.pictures.map(picture => this.pictureRepo.deletePicture(picture.id, tx))
        );
        // Suppression de la location
        const deletedLocation = await this.locationRepo.deleteLocation(id, tx);
        
        // Supression des images dans Cloudinary
        for (const cloudinaryPicture of location.pictures) {
          await cloudinary.uploader.destroy(cloudinaryPicture.publicId)
        }

        return deletedLocation;
      })
    } catch (error) {
      throw error;
    }
  }
}
