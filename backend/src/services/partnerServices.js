// Import du Repo pour communiquer avec la database
import PartnerRepository from "../repositories/PartnerRepository.js";
// Import du Repo Picture pour créer les images dans la base de données
import PictureRepository from "../repositories/PictureRepository.js";
//Import des classes pour vérifier la conformité des données
import Partner from "../classes/Partner.js";
// Import du client prisma pour créer une nouvelle instance du Repo
import prisma from "../prismaClient.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js";
// Import de la config cloudinary pour la relier au serveur
import cloudinary from "../../config/cloudinary.js";

export default class PartnerServices {
  constructor() {
    // Création d'une instance pour utiliser les méthodes de la classe repo
    this.partnerRepo = new PartnerRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  // POST Création d'un nouveau partenaire
  async createPartner(data) {
    let uploadLogo = null;
    // On déclare la variable pour qu'elle soit détectée dans le catch
    try {
      return await prisma.$transaction( async (tx) => {
        if(!data.logo) {
          data.logoId = "Id par defaut";
        } else {
          // On crée l'image dans notre db et dans notre serveur cloudinary
          uploadLogo = await cloudinary.uploader.upload(data.logo, {
            folder: "Partners"
          });
          const newPicture = await this.pictureRepo.createPicture({
            secureUrl: uploadLogo.secure_url,
            publicId: uploadLogo.public_id
          }, tx);
          data.logoId = newPicture.id;
          delete data.logo;
        }
        // Crée une nouvelle instance pour vérifier la conformité des données
        new Partner(data);
        return await this.partnerRepo.createPartner(data, tx);
      })
    } catch (error) {
      if (uploadLogo) {
        await cloudinary.uploader.destroy(uploadLogo.public_id);
      }
      throw error;
    }
  }
  
  // GET Retourne un partenaire par rapport à son id
  async getPartnerById(id) {
    try {
      const partner = await this.partnerRepo.getPartnerById(id);
      if(!partner) {
        throw new Errors.NotFoundError('Partner not found');
      }
      return partner;
    } catch (error) {
      throw error;
    }
  }

  // GET Tous les partenaires
  async getAllPartners() {
    try {
      return await this.partnerRepo.getAllPartners();
    } catch (error) {
      throw error;
    }
  }

  // PATCH Mis à jour d'un partenaire
  async updatePartner(id, data) {
    try {
      let uploadLogo = null;
      return await prisma.$transaction(async (tx) => {
        // Vérification de l'existence du partenaire
        const existingPartner = await this.partnerRepo.getPartnerById(id, tx);
        if (!existingPartner) {
          throw new Errors.NotFoundError('Partner not found');
        }
  
        // Creation du nouveau logo et supression de l'ancien
        if(data.logo) {
          uploadLogo = await cloudinary.uploader.upload(data.logo, {
            folder: "Partners"
          });
          const newPicture = await this.pictureRepo.createPicture({
            secureUrl: uploadLogo.secure_url,
            publicId: uploadLogo.public_id
          }, tx);
          data.logoId = newPicture.id;
          delete data.logo;
        }
        /* On merge les nouvelles données avec les ancienne, puis on vérifie la
        validité des nouvelles données avec une nouvelle instance de la classe
        avant de communiquer les données à la base de données
        */

       
       const newPartner = {...existingPartner, ...data};
       new Partner(newPartner);
       const updatedPartner = await this.partnerRepo.updatePartner(id, data, tx);
       
       // On supprime l'ancien logo
       if (uploadLogo && existingPartner.logoId !== "Id par defaut") {
           await cloudinary.uploader.destroy(existingPartner.logo.publicId)
           await this.pictureRepo.deletePicture(existingPartner.logoId, tx);
         }

        return updatedPartner;
      })
    } catch (error) {
      if (uploadLogo) {
        await cloudinary.uploader.destroy(uploadLogo.public_id);
      }
      throw error;
    }
  }

  // DELETE Supression d'un partenaire
  async deletePartner(id) {
    try {
      return await prisma.$transaction(async (tx) => {
        const partner = await this.partnerRepo.getPartnerById(id, tx);
        if (!partner) {
          throw new Errors.NotFoundError('Partner not found');
        }
        // Suppression de l'image si elle n'est pas l'image par défaut
        if(partner.logoId !== "defaultId") {
          await cloudinary.uploader.destroy(partner.logo.publicId);
          await this.pictureRepo.deletePicture(partner.logoId, tx);
        } 
        return await this.partnerRepo.deletePartner(id, tx);
      })
    } catch (error) {
      throw error;
    }
  }
}
