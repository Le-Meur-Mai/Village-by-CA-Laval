import TypeRepository from "../repositories/TypeRepository.js";
import StartUpRepository from "../repositories/StartUpRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import PictureRepository from "../repositories/PictureRepository.js";
// Importation de toutes les classes repository
import Picture from "../classes/Picture.js";
import StartUp from "../classes/StartUp.js";
// Importation des classes pour les verifications de format.
import prisma from "../prismaClient.js";
// importation de l'instance du prisma client
import * as Errors from "../errors/errorsClasses.js";
// importation de toutes nos classes d'erreurs personnalisées

export default class StartUpServices {
  constructor() {
    this.startUpRepo = new StartUpRepository(prisma);
    this.typeRepo = new TypeRepository(prisma);
    this.userRepo = new UserRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  // POST Creation d'une startup
  async createStartUp (data) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Verification de l'existence du user
        const user = await this.userRepo.getUserById(data.userId, tx);
        if (!user) {
          throw Errors.NotFoundError("The owner of the startup doesn't exist.");
        }
  
        // Verification de chaque type associé à la startup
        if (data.types && data.types.length > 0) {
          const types = await Promise.all(
            data.types.map(id => this.typeRepo.getTypeById(id, tx))
          );
          for (const existingType of types) {
            if (!existingType) {
              throw new Errors.NotFoundError("One of the types doesn't exist");
            }
          }
        }
  
        // Association du logo à la startup
        if (!data.logo) {
          data.logoId = "Id par defaut";
        } else {
          new Picture(data.logo);
          const newLogo = await this.pictureRepo.createPicture(data.logo, tx);
          data.logoId = newLogo.id;
        }
        // Association de l'image de description à la startup
        if (!data.descriptionPicture) {
          data.descriptionPictureId = "Id par defaut";
        } else {
          new Picture(data.descriptionPicture);
          const newDescriptionPicture = await this.pictureRepo.createPicture(data.descriptionPicture, tx);
          data.descriptionPictureId = newDescriptionPicture.id;
        }
  
        // Création de la startup après les vérification des autres entités
        new StartUp(data);
        return await this.startUpRepo.createStartUp(data, tx);

      })
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne une startUp par ID
  async getStartUpById (id) {
    try {
      const startUp = await this.startUpRepo.getStartUpById(id);
      if (!startUp) {
        throw Errors.NotFoundError("The startup doesn't exist.");
      }
      return startUp;
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne toutes les startups
  async getAllStartUps () {
    try {
      return await this.startUpRepo.getAllStartUps();
    } catch (error) {
      throw error;
    }
  }

  // PATCH Met à jour une startup
  async updateStartUp (id, data) {
    try {
      return await prisma.$transaction(async (tx) => {
        // On déclare des variables pour pouvoir gérer la suppression des images.
        let newLogo = null;
        let newDescriptionPicture = null;
        let oldLogoId = null;
        let oldDescriptionPictureId = null;
        // On vérifie que la startup existe
        const existingStartUp = await this.startUpRepo.getStartUpById(id, tx);
        if (!existingStartUp) {
          throw Errors.NotFoundError("The startup doesn't exist.");
        }
  
        // Verification de chaque type associé à la mise à jour de la startup
        if (data.types && data.types.length > 0) {
          const types = await Promise.all(
            data.types.map(id => this.typeRepo.getTypeById(id, tx))
          );
          for (const existingType of types) {
            if (!existingType) {
              throw new Errors.NotFoundError("One of the types doesn't exist");
            }
          }
        }

        // vérification du nouveau propriétaire
        if (data.userId) {
          // Fonction de vérification si c'est l'admin
          const existingUser = await this.userRepo.getUserById(data.userId, tx);
          if (!existingUser) {
            throw new Errors.NotFoundError("The new owner is not found.");
          }
        }
  
        // Création du nouveau logo
        if (data.logo) {
          oldLogoId = existingStartUp.logoId;
          new Picture(data.logo);
          newLogo = await this.pictureRepo.createPicture(data.logo, tx);
          data.logoId = newLogo.id
        }
  
        // Création d'une image de description
        if (data.descriptionPicture) {
          oldDescriptionPictureId = existingStartUp.descriptionPictureId;
          new Picture(data.descriptionPicture);
          newDescriptionPicture = await this.pictureRepo.createPicture(data.descriptionPicture, tx);
          data.descriptionPictureId = newDescriptionPicture.id;
        }
  
        // Fusion des nouvelles et des anciennes données
        const fullStartUp = {...existingStartUp, ...data};
        new StartUp(fullStartUp);
        const newStartUp = await this.startUpRepo.updateStartUp(id, data, tx);
  
        // Suppression des anciennes images
        if (newLogo && oldLogoId !== "Id par defaut") {
          await this.pictureRepo.deletePicture(oldLogoId, tx);
        }
        if (newDescriptionPicture && oldDescriptionPictureId !== "Id par defaut") {
          await this.pictureRepo.deletePicture(oldDescriptionPictureId, tx);
        }
        return newStartUp;
      })
    } catch (error) {
      throw error;
    }
  }

  // DELETE Suppression d'un startup
  async deleteStartUp (id) {
    return await prisma.$transaction(async (tx) => {
      try {
        const existingStartUp = await this.startUpRepo.getStartUpById(id, tx);
        if (!existingStartUp) {
          throw Errors.NotFoundError("The startup doesn't exist.");
        }

        // Supression des images
        if (existingStartUp.logoId !== "Id par défaut") {
          await this.pictureRepo.deletePicture(existingStartUp.logoId, tx);
        }
        if (existingStartUp.descriptionPictureId !== "Id par défaut") {
          await this.pictureRepo.deletePicture(existingStartUp.descriptionPictureId, tx);
        }

        const deletedStartUp = await this.startUpRepo.deleteStartUp(id, tx);

        return deletedStartUp;
      } catch (error) {
      throw error;}
    })
  }
}
