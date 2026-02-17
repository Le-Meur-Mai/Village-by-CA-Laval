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
import * as Errors from "../errors/errorsHandler.js";
// importation de toutes nos classes d'erreurs personnalisées

export default class StartUpServices {
  constructor() {
    this.startUpRepo = StartUpRepository(prisma);
    this.typeRepo = TypeRepository(prisma);
    this.userRepo = UserRepository(prisma);
    this.pictureRepo = PictureRepository(prisma);
  }

  // POST Creation d'une startup
  async createStartUp (data) {
    // On déclare les variables ici pour qu'elles soient détectées dans le catch
    let newLogo = null;
    let newDescriptionPicture = null;
    try {
      // Verification de l'existence du user
      const user = await this.userRepo.getUserById(data.userId);
      if (!user) {
        throw Errors.NotFoundError("The owner of the startup doesn't exist.");
      }

      // Verification de chaque type associé à la startup
      if (data.types && data.types.length > 0) {
        for (const id of data.types) {
          const existingType = this.typeRepo.getTypeById(id);
          if (!existingType) {
            throw Errors.NotFoundError("One of the types doesn't exist.");
          }
        }
      }

      // Association du logo à la startup
      if (!data.logo) {
        data.logoId = "Id par defaut";
      } else {
        new Picture(data.logo);
        newLogo = await this.pictureRepo.createPicture(data.logo);
        data.logoId = newLogo.id;
      }
      // Association de l'image de description à la startup
      if (!data.descriptionPicture) {
        data.descriptionPictureId = "Id par defaut";
      } else {
        new Picture(data.descriptionPicture);
        newDescriptionPicture = await this.pictureRepo.createPicture(data.descriptionPicture);
        data.descriptionPictureId = newDescriptionPicture.id;
      }

      // Création de la startup après les vérification des autres entités
      new StartUp(data);
      return await this.startUpRepo.createStartUp(data);
    } catch (error) {
      // On supprime les entités orphelines
      if (newLogo && newLogo.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(newLogo.id);
      }
      if (newDescriptionPicture && newDescriptionPicture.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(newDescriptionPicture.id);
      }
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
    // On déclare les variables ici pour qu'elles soient détectées dans le catch
    let newLogo = null;
    let newDescriptionPicture = null;
    try {
      const existingStartUp = await this.startUpRepo.getStartUpById(id);
      if (!existingStartUp) {
        throw Errors.NotFoundError("The startup doesn't exist.");
      }

      // Verification de chaque type associé à la mise à jour de la startup
      if (data.types && data.types.length > 0) {
        for (const typeId of data.types) {
          const existingType = this.typeRepo.getTypeById(typeId);
          if (!existingType) {
            throw Errors.NotFoundError("One of the types doesn't exist.");
          }
        }
      }

      if (data.userId) {
        const existingUser = this.userRepo.getUserById(data.userId);
        if (!existingUser) {
          throw new Errors.NotFoundError("The new owner is not found.");
        }
      }

      // Création du nouveau logo
      if (data.logo) {
        new Picture(data.logo);
        newLogo = await this.pictureRepo.createPicture(data.logo);
        data.logoId = newLogo.id
      }

      // Création d'une image de description
      if (data.descriptionPicture) {
        new Picture(data.descriptionPicture);
        newDescriptionPicture = await this.pictureRepo.createPicture(data.descriptionPicture);
        data.descriptionPictureId = newDescriptionPicture.id;
      }

      // Fusion des nouvelles et des anciennes données
      const fullStartUp = {...existingStartUp, ...data};
      new StartUp(fullStartUp);
      const newStartUp = await this.startUpRepo.updateStartUp(id, data);

      // Suppression des anciennes images
      if (newLogo && newLogo.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(existingStartUp.logoId);
      }
      else if (newDescriptionPicture && newDescriptionPicture.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(existingStartUp.descriptionPictureId);
      }

      return newStartUp;

    } catch (error) {

      // On supprime les entites orphelines
      if (newLogo && newLogo.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(newLogo.id);
      }
      if (newDescriptionPicture && newDescriptionPicture.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(newDescriptionPicture.id);
      }
      throw error;
    }
  }

  // DELETE Suppression d'un startup
  async deleteStartUp (id) {
    let logo = null;
    let descriptionPicture = null;
    const existingStartUp = await this.startUpRepo.getStartUpById(id);
    if (!existingStartUp) {
      throw Errors.NotFoundError("The startup doesn't exist.");
    }
    // On garde en mémoire les images pour les supprimer après
    logo = existingStartUp.logo;
    descriptionPicture = existingStartUp.descriptionPicture;

    // Supression des images
    const deletedStartUp = await this.startUpRepo.deleteStartUp(id);
    if (logo.id !== "Id par défaut") {
      await this.pictureRepo.deletePicture(logo.id);
    }
    if (descriptionPicture !== "Id par défaut") {
      await this.pictureRepo.deletePicture(descriptionPicture.id);
    }

    return deletedStartUp;
  } catch (error) {
    throw error;
  }
}
