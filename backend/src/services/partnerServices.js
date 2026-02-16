// Import du Repo pour communiquer avec la database
import PartnerRepository from "../repositories/PartnerRepository.js";
// Import du Repo Picture pour créer les images dans la base de données
import PictureRepository from "../repositories/PictureRepository.js";
//Import des classes pour vérifier la conformité des données
import Partner from "../classes/Partner.js";
import Picture from "../classes/Picture.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsHandler.js";

export default class PartnerServices {
  constructor() {
    // Création d'une instance pour utiliser les méthodes de la classe repo
    this.repo = new PartnerRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  async createPartner(data) {
    try {
      if(!data.logo) {
        // assigner l'id de l'image par défaut : data.logoId = defaultId
      } else {
        const picture = data.logo;
        new Picture(picture);
        const newPicture = await this.pictureRepo.createPicture(picture);
        data.logoId = newPicture.id;
      }
    } catch (error) {
      throw error;
    }

    try {
      // Crée une nouvelle instance pour vérifier la conformité des données
      new Partner(data);
      // Importer fonction de hachage et remplacer le mdp de data
      return await this.repo.createPartner(data);
    } catch (error) {
      // Suppression de l'image si elle n'est pas l'image par défaut
      if(/*data.logoId !== defaultId */) {
        await this.pictureRepo.deletePicture(data.logoId);
      }
      throw error;
    }
  }
  
  async getPartnerById(id) {
    try {
      const partner = await this.repo.getPartnerById(id);
      if(!partner) {
        throw new Errors.NotFoundError('Partner not found');
      }
      return partner;
    } catch (error) {
      throw error;
    }
  }

  async getAllPartner() {
    try {
      return await this.repo.getAllPartners();
    } catch (error) {
      throw error;
    }
  }

  async updatePartner(id, data) {
    try {
      const existingPartner = await this.repo.getPartnerById(id);
      if (!existingPartner) {
        throw new Errors.NotFoundError('Partner not found');
      }

      if(data.logo) {
        new Picture(data.logo);
        const picture = await this.pictureRepo.createPicture(data.logo);
        data.logoId = picture.id;
      }
      const oldPictureId = existingPartner.logoId;
      /* On merge les nouvelles données avec les ancienne, puis on vérifie la
      validité des nouvelles données avec une nouvelle instance de la classe
      avant de communiquer les données à la base de données
      */
      const newPartner = {...existingPartner, ...data};
      new Partner(newPartner);
      const updatedPartner = await this.repo.updatePartner(id, data);
      if (oldPictureId !== /*Picture by default*/) {
        await this.repo.deletePicture(oldPictureId);
      }
      return updatedPartner;
    } catch (error) {
      throw error;
    }
  }

  async deletePartner(id) {
    try {
      const partner = await this.repo.getPartnerById(id);
      if (!partner) {
        throw new Errors.NotFoundError('Partner not found');
      }
      // Suppression de l'image si elle n'est pas l'image par défaut
      if(/*partner.logoId !== defaultId */) {
        await this.pictureRepo.deletePicture(data.logoId);
      } 
      return await this.repo.deletePartner(id);
    } catch (error) {
      throw error;
    }
  }
}
