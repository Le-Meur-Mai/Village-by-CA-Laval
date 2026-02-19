// Import du Repo pour communiquer avec la database
import UserRepository from "../repositories/UserRepository.js";
//Import de la classe pour vérifier la conformité des données
import User from "../classes/User.js";
// Import du service Startup pour la supression d'un user
import StartUpServices from "./startUpServices.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js";

export default class UserServices {
  constructor() {
    // Création d'une instance pour utiliser les méthodes de la classe repo
    this.UserRepo = new UserRepository(prisma);
    this.StartUpServices = new StartUpServices();
  }

  // POST Création d'un user
  async createUser(data) {
    try {
      // Crée une nouvelle instance pour vérifier la conformité des données
      new User(data);
      // Importer fonction de hachage et remplacer le mdp de data
      return await this.repo.createUser(data);
    } catch (error) {
      throw error;
    }
  }

  // GET retourne un user grâce à son id
  async getUserById(id) {
    try {
      const user = await this.repo.getUserById(id);
      if (!user) {
        throw new Errors.NotFoundError('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne tous les users existants
  async getAllUsers() {
    try {
      return await this.repo.getAllUsers();
    } catch (error) {
      throw error;
    }
  }

  // PATCH mise à jour d'un user
  async updateUser(id, data) {
    try {
      // Vérifie que le User existe
      const existingUser = await this.repo.getUserById(id);
      if (!existingUser) {
        throw new Errors.NotFoundError('User not found');
      }
      /*On va merge les données de l'utilisateur existant avec les nouvelles
      données dans un nouvel objet avec l'operateur spread de js, s'il y a des
      nouvelles données identiques à l'objet de base elles vont les écraser*/
      const newUser = {...existingUser, ...data};
      new User(newUser);
      return await this.repo.updateUser(id, data);
    } catch (error) {
      throw error;
    }
  }

  // DELETE Supression d'un user
  async deleteUser(id) {
    try {
      return await prisma.$transaction(async (tx) => {
        const user = await this.repo.getUserById(id, tx);
        if(!user) {
          throw new Errors.NotFoundError('User not found');
        }
        await StartUpServices.deleteStartUp(user.startUp.id, tx);
        return await this.repo.deleteUser(id, tx);
      })
    } catch (error) {
      throw error;
    }
  }
}
