// Importation du repo de l'utilisateur pour des opérations prisma
import UserRepository from "../repositories/UserRepository.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"
// Import de la fonction cloudinary pour envoyer les images sur l'hébergeur
import uploadPictureToCloudinary from "../utils/uploadToCloudinary.js";
// Importation de la config Cloudinary pour pouvoir supprimer des images
import cloudinary from "../../config/cloudinary.js";
// Importation de la fonction pour checker le mot de passe
import checkPassword from "../utils/checkPassword.js";

export default class AuthServices {
  constructor () {
    this.userRepo = new UserRepository(prisma);
  }

  /* Vérifie que l'utilisateur utilise la bonne addresse mail et le bon mdp.
  Renvoie l'id et le rôle du compte pour générer le token*/
  async login(data) {
    try {
      return await prisma.$transaction(async (tx) => {
        const existingUser = await this.userRepo.findUserByEmail(data.email, tx);
        if (!existingUser) {
          throw new Errors.NotFoundError('User not found');
        } else if(checkPassword(data.password, existingUser.password)) {
          return {id: existingUser.id, isAdmin: existingUser.isAdmin};
        }
      })
    } catch (error) {
      throw error;
    }
  }
  
  // Get the user profile
  async getProfile(id) {
    try {
      const existingUser = await this.userRepo.getUserById(id);
      if (!existingUser) {
        throw new Errors.NotFoundError('User not found');
      } else {
        const profile = {
          user: {name: existingUser.name, email: existingUser.email}
        };
        if (existingUser.startUp !== null) {
          profile.startUp = {
            id: existingUser.startUp.id,
            name: existingUser.startUp.name,
            description: existingUser.startUp.description,
            isAlumni: existingUser.startUp.isAlumni,
            website: existingUser.startUp.website,
            logo: existingUser.startUp.logo.secureUrl,
            descriptionPicture: existingUser.startUp.descriptionPicture.secureUrl,
            types: existingUser.startUp.types
          };
        } else {
          profile.startUp = null;
        }
        if (existingUser.quotes.length > 0) {
          profile.quotes = existingUser.quotes;
        } else {
          profile.quotes = [];
        }
        return profile;
      }
    } catch (error) {
      throw error;
    }
  }
}
