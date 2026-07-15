// Import du Repo pour communiquer avec la database
import UserRepository from "../repositories/UserRepository.js";
//Import de la classe pour vérifier la conformité des données
import User from "../classes/User.js";
//Import de la fonction pour contre l'injection de clés suplémmentaires
import validFields from "../utils/validFields.js";
// Import du service Startup et Quote pour la supression d'un user
import StartUpServices from "./startUpServices.js";
import QuoteServices from "./quoteServices.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js";
// Import de la fonction de hashage du mot de passe
import hashPassword from "../utils/hashPassword.js";

const allowedFields = ["isAdmin", "name", "email", "password"];

export default class UserServices {
  constructor() {
    // Création d'une instance pour utiliser les méthodes de la classe repo
    this.userRepo = new UserRepository(prisma);
    this.startUpServices = new StartUpServices(prisma);
    this.quoteServices = new QuoteServices(prisma);
  }

  // POST Création d'un user
  async createUser(data) {
    try {
      const user = await this.userRepo.findUserByEmail(data.email);
      if (user) {
        throw new Errors.ValidationError("Cet email est déjà utilisé.");
      }
      validFields(data, allowedFields);
      // Crée une nouvelle instance pour vérifier la conformité des données
      new User(data);
      data.password = await hashPassword(data.password); 
      data.isAdmin = false;
      return await this.userRepo.createUser(data);
    } catch (error) {
      throw error;
    }
  }

  // GET retourne un user grâce à son id
  async getUserById(id) {
    try {
      const user = await this.userRepo.getUserById(id);
      if (!user) {
        throw new Errors.NotFoundError("L'utilisateur n'existe pas.");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne tous les users existants
  async getAllUsers() {
    try {
      return await this.userRepo.getAllUsers();
    } catch (error) {
      throw error;
    }
  }

  // PATCH mise à jour d'un user
  async updateUser(id, data, isAdmin) {
    try {
      // Vérifie que le User existe
      const existingUser = await this.userRepo.getUserById(id);
      if (!existingUser) {
        throw new Errors.NotFoundError("L'utilisateur n'existe pas.");
      }

      validFields(data, allowedFields);

      const user = await this.userRepo.findUserByEmail(data.email);
      if (user) {
        throw new Errors.ValidationError("Cet email est déjà utilisé.");
      }

      // Avant de modifier le mot de passe, vérifier que c'est bien un admin.
      if (data.password && isAdmin) {
        data.password = await hashPassword(data.password);
      } else if (data.password && !isAdmin) {
        throw new Errors.ForbiddenError('Seul un admin peut modifier le mot de passe');
      }
      /*On va merge les données de l'utilisateur existant avec les nouvelles
      données dans un nouvel objet avec l'operateur spread de js, s'il y a des
      nouvelles données identiques à l'objet de base elles vont les écraser*/
      const newUser = {...existingUser, ...data};
      new User(newUser);
      const updatedUser = await this.userRepo.updateUser(id, data);
      return {name: updatedUser.name, email: updatedUser.email};
    } catch (error) {
      throw error;
    }
  }

  // DELETE Supression d'un user
  async deleteUser(id, currentUser) {
    try {
      return await prisma.$transaction(async (tx) => {
        const user = await this.userRepo.getUserById(id, tx);
        if(!user) {
          throw new Errors.NotFoundError("L'utilisateur n'existe pas.");
        }
        if (user.quotes && user.quotes.length > 0) {
          await Promise.all(user.quotes.map(quote => this.quoteServices.deleteQuote(quote.id, currentUser)));
        }
        if (user.startUp?.id) {
          await this.startUpServices.deleteStartUp(user.startUp.id, tx);
        }
        return await this.userRepo.deleteUser(id, tx);
      })
    } catch (error) {
      throw error;
    }
  }
}
