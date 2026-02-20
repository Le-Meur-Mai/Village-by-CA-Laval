import TypeRepository from "../repositories/TypeRepository.js";
import StartUpRepository from "../repositories/StartUpRepository.js";
import Type from "../classes/Type.js";
import prisma from "../prismaClient.js";
// importation de l'instance du prisma client
import * as Errors from "../errors/errorsClasses.js";
// importation de toutes nos classes d'erreurs personnalisées

export default class TypeServices {
  constructor() {
    this.typeRepo = new TypeRepository(prisma);
    this.startUpRepo = new StartUpRepository(prisma);
  }

  // POST Création d'un type
  async createType (data) {
    try {
      if (data.startUps && data.startUps.length > 0) {
        for (const startUp of data.startUps) {
          const existingStartUp = await this.startUpRepo.getStartUpById(startUp.id);
          if (!existingStartUp) {
            throw new Errors.NotFoundError("One start-up doesn't exist.");
          }
        }
      }
      new Type(data);
      return await this.typeRepo.createType(data);
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne un type grâce à son ID
  async getTypeById (id) {
    try {
      const existingtype = await this.typeRepo.getTypeById(id);
      if (!existingtype) {
        throw new Errors.NotFoundError("Type not found");
      }
      return existingtype;
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne tous les types existants
  async getAllTypes () {
    try {
      return await this.typeRepo.getAllTypes();
    } catch (error) {
      throw error;
    }
  }

  // PATCH Mise à jour d'un type
  async updateType (id, data) {
    try {
      const existingType = await this.typeRepo.getTypeById(id);
      if (!existingType) {
        throw new Errors.NotFoundError("Type not found.");
      }

      if (data.startUps && data.startUps.length > 0) {
        for (const id of data.startUps.id) {
          const startUp = await this.startUpRepo.getStartUpById(id);
          if (!startUp) {
            throw new Errors.NotFoundError("One start-up doesn't exist.");
          }
        }
      }

      const newType = {...existingType, ...data};
      // On fusionne les anciennes et nouvelles données
      new Type(newType);
      return await this.typeRepo.updateType(data);
    } catch (error) {
      throw error;
    }
  }

  // DELETE Supression d'un type
  async deleteType (id) {
    try {
      const existingType = await this.typeRepo.getTypeById(id);
      if (!existingType) {
        throw new Errors.NotFoundError("Type not found");
      }
      return await this.typeRepo.deleteType(id);
    } catch (error) {
      throw error;
    }
  }
}
