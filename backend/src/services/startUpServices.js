// Importation de toutes les classes repository
import TypeRepository from "../repositories/TypeRepository.js";
import StartUpRepository from "../repositories/StartUpRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import PictureRepository from "../repositories/PictureRepository.js";
// Importation de classe pour les verifications de format.
import StartUp from "../classes/StartUp.js";
// importation de l'instance du prisma client
import prisma from "../prismaClient.js";
// importation de toutes nos classes d'erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js";
// Import de la fonction cloudinary pour envoyer les images sur l'hébergeur
import uploadPictureToCloudinary from "../utils/uploadToCloudinary.js";
// Importation de la config Cloudinary pour pouvoir supprimer des images
import cloudinary from "../../config/cloudinary.js";

export default class StartUpServices {
  constructor() {
    this.startUpRepo = new StartUpRepository(prisma);
    this.typeRepo = new TypeRepository(prisma);
    this.userRepo = new UserRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  // POST Creation d'une startup
  async createStartUp (data) {
    let uploadLogo = null;
    let uploadDescriptionPicture = null;
    // On déclare ces variables pour qu'elles soient détectées dans le catch
    try {
      return await prisma.$transaction(async (tx) => {
        // Verification de l'existence du user
        const user = await this.userRepo.getUserById(data.userId, tx);
        if (!user) {
          throw new Errors.NotFoundError("The owner of the startup doesn't exist.");
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
          // Création de l'image dans cloudinary puis dans la db
          uploadLogo = await uploadPictureToCloudinary(data.logo, "StartUps");
          const newLogoStartUp = {
            secureUrl: uploadLogo.secure_url,
            publicId: uploadLogo.public_id
          }
          const newLogo = await this.pictureRepo.createPicture(newLogoStartUp, tx);
          data.logoId = newLogo.id;
          delete data.logo;
        }
        // Association de l'image de description à la startup
        if (!data.descriptionPicture) {
          data.descriptionPictureId = "Id par defaut";
        } else {
          // // Création de l'image dans cloudinary puis dans la db
          uploadDescriptionPicture = await uploadPictureToCloudinary(data.descriptionPicture, "StartUps");
          const newDescriptionPictureStartup = {
            secureUrl: uploadDescriptionPicture.secure_url,
            publicId: uploadDescriptionPicture.public_id
          }
          const newDescriptionPicture = await this.pictureRepo.createPicture(newDescriptionPictureStartup, tx);
          data.descriptionPictureId = newDescriptionPicture.id;
          delete data.descriptionPicture;
        }
  
        // Création de la startup après les vérification des autres entités
        new StartUp(data);
        return await this.startUpRepo.createStartUp(data, tx);

      })
    } catch (error) {
      if (uploadLogo) {
        await cloudinary.uploader.destroy(uploadLogo.public_id);
      }
      if (uploadDescriptionPicture) {
        await cloudinary.uploader.destroy(uploadDescriptionPicture.public_id)
      }
      throw error;
    }
  }

  // GET Retourne une startUp par ID
  async getStartUpById (id) {
    try {
      const startUp = await this.startUpRepo.getStartUpById(id);
      if (!startUp) {
        throw new Errors.NotFoundError("The startup doesn't exist.");
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
  async updateStartUp (id, data, currentUser) {
    let uploadLogo = null;
    let uploadDescriptionPicture = null;
    try {
      return await prisma.$transaction(async (tx) => {
        // On déclare des variables pour pouvoir gérer la suppression des images.
        let oldLogo = null;
        let oldDescriptionPicture = null;
        // On vérifie que la startup existe
        const existingStartUp = await this.startUpRepo.getStartUpById(id, tx);
        if (!existingStartUp) {
          throw new Errors.NotFoundError("The startup doesn't exist.");
        }

        // On vérifie que c'est un admin ou le propriétaire qui veut modifier la startup
        if (!currentUser.isAdmin && existingStartUp.user.id !== currentUser.id) {
          throw new Errors.ForbiddenError(
            "You have to be the owner or an admin to modify this startup.");
        }
        
        // vérification du nouveau propriétaire
        if (data.userId && currentUser.isAdmin) {
          const existingUser = await this.userRepo.getUserById(data.userId, tx);
          if (!existingUser) {
            throw new Errors.NotFoundError("The new owner is not found.");
          }
        } else if (data.userId && !currentUser.isAdmin) {
          throw new Errors.ForbiddenError('Only a admin can modify this data');
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

  
        // Création du nouveau logo
        if (data.logo) {
          oldLogo = await this.pictureRepo.getPictureById(existingStartUp.logoId, tx);
          uploadLogo = await uploadPictureToCloudinary(data.logo, "StartUps");
          const newLogoStartUp = {
            secureUrl: uploadLogo.secure_url,
            publicId: uploadLogo.public_id
          }
          const newLogo = await this.pictureRepo.createPicture(newLogoStartUp, tx);
          data.logoId = newLogo.id
          delete data.logo;
        }
  
        // Création d'une image de description
        if (data.descriptionPicture) {
          oldDescriptionPicture = await this.pictureRepo.getPictureById(existingStartUp.descriptionPictureId, tx);
          uploadDescriptionPicture = await uploadPictureToCloudinary(data.descriptionPicture, "StartUps");

          const newDescriptionPictureStartup = {
            secureUrl: uploadDescriptionPicture.secure_url,
            publicId: uploadDescriptionPicture.public_id
          }
          const newDescriptionPicture = await this.pictureRepo.createPicture(newDescriptionPictureStartup, tx);
          data.descriptionPictureId = newDescriptionPicture.id;
          delete data.descriptionPicture;
        }
  
        // Fusion des nouvelles et des anciennes données
        const fullStartUp = {...existingStartUp, ...data};
        new StartUp(fullStartUp);
        const newStartUp = await this.startUpRepo.updateStartUp(id, data, tx);
  
        // Suppression des anciennes images
        if (uploadLogo && oldLogo && oldLogo.id !== "Id par defaut") {
          await cloudinary.uploader.destroy(oldLogo.publicId);
          await this.pictureRepo.deletePicture(oldLogo.id, tx);
        }
        if (uploadDescriptionPicture && oldDescriptionPicture && oldDescriptionPicture.id !== "Id par defaut") {
          await cloudinary.uploader.destroy(oldDescriptionPicture.publicId);
          await this.pictureRepo.deletePicture(oldDescriptionPicture.id, tx);
        }
        return newStartUp;
      })
    } catch (error) {
      if (uploadLogo) {
        await cloudinary.uploader.destroy(uploadLogo.public_id);
      }
      if (uploadDescriptionPicture) {
        await cloudinary.uploader.destroy(uploadDescriptionPicture.public_id);
      }
      throw error;
    }
  }

  // DELETE Suppression d'un startup
  async deleteStartUp (id) {
    return await prisma.$transaction(async (tx) => {
      try {
        const existingStartUp = await this.startUpRepo.getStartUpById(id, tx);
        if (!existingStartUp) {
          throw new Errors.NotFoundError("The startup doesn't exist.");
        }
        
        const deletedStartUp = await this.startUpRepo.deleteStartUp(id, tx);

        // Supression des images
        if (existingStartUp.logoId !== "Id par défaut") {
          await cloudinary.uploader.destroy(existingStartUp.logo.publicId);
          await this.pictureRepo.deletePicture(existingStartUp.logoId, tx);
        }
        if (existingStartUp.descriptionPictureId !== "Id par défaut") {
          await cloudinary.uploader.destroy(existingStartUp.descriptionPicture.publicId);
          await this.pictureRepo.deletePicture(existingStartUp.descriptionPictureId, tx);
        }


        return deletedStartUp;
      } catch (error) {
      throw error;}
    })
  }
}
