// Import du Repo pour communiquer avec la database
import LocationRepository from "../repositories/LocationRepository.js";
// Import du Repo Picture pour créer les images dans la base de données
import PictureRepository from "../repositories/PictureRepository.js"
//Import de la classe pour vérifier la conformité des données
import Location from "../classes/Location.js";
import Picture from "../classes/Picture.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsHandler.js"

export default class LocationServices{
  constructor() {
    // Création d'une instance pour utiliser les méthodes de la classe repo
    this.repo = new LocationRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  async createLocation(data) {
    // Création de l'ID de l'image
    const createdPictures = [];
    try {
      // Vérifie que le nombre d'image est correct
      if(!data.pictures || data.pictures.length < 1 || data.pictures.length > 5) {
        throw new Errors.ValidationError('You must have between 1 and 5 pictures');
      } else {
        // Pour chaque image dans data.pictures, on crée une nouvelle image
        for (const picture of data.pictures) {
          new Picture(picture);
          const newPicture = await this.pictureRepo.createPicture(picture);
          // On l'ajoute dans le tableau createdPictures
          createdPictures.push(newPicture);
        }
        // Remplace les données de data.pictures par le tableau d'images créées
        data.pictures = createdPictures;
      }
    } catch (error) {
      // On supprime les images créé s'il y a une erreur
      for (const picture in createdPictures) {
        await this.pictureRepo.deletePicture(picture.id);
      }
      throw error;
    }
    // Création de la location
    try {
      // Crée une nouvelle instance pour vérifier la conformité des données
      new Location(data);
      return await this.repo.createLocation(data);
    } catch (error) {
      // Suppression des images
      for (const picture in createdPictures) {
        await this.pictureRepo.deletePicture(picture.id);
      }
      throw error;
    }
  }

  async getLocationById(id) {
    try {
      const location = await this.repo.getLocationById(id);
      if(!location) {
        throw new Errors.NotFoundError('Location not found');
      }
      return location;
    } catch (error) {
      throw error;
    }
  }

  async getAllLocations() {
    try {
      return await this.repo.getAllLocations();
    } catch (error) {
      throw error;
    }
  }
 
 async updateLocation(id, data) {
   // Tableau contenant les nouvelles images crées de la place
   const createdPictures = [];
    try {
      // vérification si la location existe dans la bdd
      const existingLocation = await this.repo.getLocationById(id);
      if(!existingLocation) {
        throw new Errors.NotFoundError('Location not found');
      }

      const updatedPictures = [];
      const sendPictures = data.pictures;
      const oldPictures = existingLocation.pictures;
      const newPictures = [];
      // On vérifie les images déjà présente dans la base de données
      for (const picture of sendPictures) {
        if (picture.id) {
          updatedPictures.push(picture);
        } else {
          newPictures.push(picture);
        } 
      }
      // On vérifie si les anciennes images sont envoyées, sinon on les supprimes
      for (const picture of oldPictures) {
        /* 
        La méthode some retourne false si l'id de la picture ne correspond pas à
        un id existant dans updatedPictures
        */
        if(!updatedPictures.some(p => p.id === picture.id)){
          await this.pictureRepo.deletePicture(picture.id);
        }
      }
      // On crée les nouvelles images dans la base de données
      for (const picture of newPictures) {
        new Picture(picture);
        const newPicture = await this.pictureRepo.createPicture(picture);
        createdPictures.push(newPicture);
      }
      // On ajoute les nouvelles images dans updatedPictures
      for (const picture of createdPictures) {
        updatedPictures.push(picture);
      }

      data.pictures = updatedPictures;

      // On remplace les anciennes données par les nouvelles
      const newLocation = {...existingLocation, ...data};
      new Location(newLocation);

      // On crée la nouvelle location
      return await this.repo.updateLocation(id, data);

    } catch (error) {
      // On supprime les nouvelles images crées
      for (const picture of createdPictures) {
        await this.pictureRepo.deletePicture(picture.id);
      }
      throw error;
    }
  }

  async deleteLocation(id) {
    try {
      /* 
      Création d'une transaction Prisma : si une transaction échoue, les autres
      s'annulent 
      */
      return prisma.$transaction(async (tx) => {
        const location = await tx.location.findUnique({
          where: { id },
          include: { pictures: true }
        });
        if(!location) {
          throw new Errors.NotFoundError('Location not found');
        }
        
        // Suppression des images
        await tx.picture.deleteMany({
          where: { locationId: id }
        });

        // Suppression de la location
        return tx.location.delete({
          where: { id }
        });

      })

    } catch (error) {
      throw error;
    }
  }
}
