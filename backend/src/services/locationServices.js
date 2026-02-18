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
    try {
      /* 
      Création d'une transaction Prisma : si une transaction échoue, les autres
      s'annulent 
      */
      return prisma.$transaction(async (tx) => {
        if(!data.pictures || data.pictures.length < 1 || data.pictures.length > 5) {
          throw new Errors.ValidationError('You must have between 1 and 5 pictures');
        } else {
          // Pour chaque image dans data.pictures, on crée une nouvelle image
          const createdPictures = await Promise.all(
            data.pictures.map(picture => {
              new Picture(picture);
              return this.pictureRepo.createPicture(picture, tx);
            })
          )
          // Remplace les données de data.pictures par le tableau d'images créées
          data.pictures = createdPictures;

          // Crée une nouvelle instance pour vérifier la conformité des données
          new Location(data);
          return await this.repo.createLocation(data, tx);
        }
      })
    } catch (error) {
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
    try {
      return prisma.$transaction(async (tx) => {
        const existingLocation = await this.repo.getLocationById(id, tx);
        if(!existingLocation) {
          throw new Errors.NotFoundError('Location not found');
        }

        const oldPictures = existingLocation.pictures;
        const updatedPictures = []
        const sendPictures = []

        // Trie les images existantes des nouvelles
        for (const picture of data.pictures) {
          if(picture.id) {
            updatedPictures.push(picture);
          } else {
            sendPictures.push(picture);
          }
        }
        // Supprime les anciennes images
        await Promise.all(
          oldPictures
            /* 
            On filtre les images supprimées dans un tableau avant de le parcourir avec map
            La méthode some retourne false si l'id de la picture ne correspond pas 
            à un id existant dans updatedPictures
            */
            .filter(oldPic => !updatedPictures.some(p => p.id == oldPic.id))
            .map(picture => this.pictureRepo.deletePicture(picture.id, tx))
        );
        // Crée les nouvelles images avec Promise.all qui va lancer les promesses en parallèle
        const createdPictures = await Promise.all(
          sendPictures.map(picture => {
            new Picture(picture);
            return this.pictureRepo.createPicture(picture, tx);
          })
        )

        updatedPictures.push(...createdPictures);
        data.pictures = updatedPictures;

        // On remplace les anciennes données par les nouvelles
        const newLocation = {...existingLocation, ...data};
        new Location(newLocation);

        return await this.repo.updateLocation(id, data, tx);
      })
    } catch (error) {
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
        const location = await this.repo.getLocationById(id, tx);
        if(!location) {
          throw new Errors.NotFoundError('Location not found');
        }
        // Suppression des images
        await tx.picture.deleteMany({
          where: { locationId: id }
        });
        // Suppression de la location
        return await this.repo.deleteLocation(id, tx);
      })
    } catch (error) {
      throw error;
    }
  }
}
