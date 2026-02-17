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

  // POST Création d'un nouveau partenaire
  async createPartner(data) {
    let newPicture = null;
    try {
      if(!data.logo) {
        data.logoId = "Id par defaut";
      } else {
        const picture = data.logo;
        new Picture(picture);
        newPicture = await this.pictureRepo.createPicture(picture);
        data.logoId = newPicture.id;
      }
      // Crée une nouvelle instance pour vérifier la conformité des données
      new Partner(data);
      return await this.repo.createPartner(data);
    } catch (error) {
      // Suppression de l'image si elle n'est pas l'image par défaut
      if(newPicture && newPicture.id !== "Id par defaut") {
        await this.pictureRepo.deletePicture(data.logoId);
      }
      throw error;
    }
  }
  
  // GET Retourne un partenaire par rapport à son id
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

  // GET Tous les partenaires
  async getAllPartner() {
    try {
      return await this.repo.getAllPartners();
    } catch (error) {
      throw error;
    }
  }

  // PATCH Mis à jour d'un partenaire
  async updatePartner(id, data) {
    // on déclare notre variable ici pour qu'elle puisse être détectée par le catch
    let newLogo = null;
    try {
      // Vérification de l'existence du partenaire
      const existingPartner = await this.repo.getPartnerById(id);
      if (!existingPartner) {
        throw new Errors.NotFoundError('Partner not found');
      }

      // Creation du nouveau logo
      if(data.logo) {
        new Picture(data.logo);
        newLogo = await this.pictureRepo.createPicture(data.logo);
        data.logoId = newLogo.id;
      }
      const oldPictureId = existingPartner.logoId;
      /* On merge les nouvelles données avec les ancienne, puis on vérifie la
      validité des nouvelles données avec une nouvelle instance de la classe
      avant de communiquer les données à la base de données
      */
      const newPartner = {...existingPartner, ...data};
      new Partner(newPartner);
      const updatedPartner = await this.repo.updatePartner(id, data);
      if (oldPictureId !== "Id par defaut") {
        await this.repo.deletePicture(oldPictureId);
      }
      return updatedPartner;
    } catch (error) {
      if(newLogo && newLogo !== "Id par defaut") {
        await this.pictureRepo.deletePicture(data.logoId);
      }
      throw error;
    }
  }

  // DELETE Supression d'un partenaire
  async deletePartner(id) {
    try {
      const partner = await this.repo.getPartnerById(id);
      if (!partner) {
        throw new Errors.NotFoundError('Partner not found');
      }
      // Suppression de l'image si elle n'est pas l'image par défaut
      if(partner.logoId !== "defaultId") {
        await this.pictureRepo.deletePicture(data.logoId);
      } 
      return await this.repo.deletePartner(id);
    } catch (error) {
      throw error;
    }
  }
}
