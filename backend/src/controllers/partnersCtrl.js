// Import des services que l'on va appeler dans les controllers
import PartnerServices from "../services/partnerServices";

// crée un nouveau partenaire
// On renvoie le résultat du service, sinon l'erreur est prise en charge par le errorHandler automatiquement
const createPartner = async (req, res, next) => {
  try {
    const data = req.body;
    const newPartner = await PartnerServices.createPartner({
      name: data.name,
      description: data.description,
      website: data.website,
      financialAid: data.financialAid,
      logo: data.logo
    });
    res.status(201).json(newPartner);
  } catch (error) {
    next(error);
  }
}

// Trouve un partenaire avec son ID
const getPartnerById = async (req, res, next) => {
  try {
    // Enregistre l'id dans la variable id
    const id = req.params.id;
    const partner = await PartnerServices.getPartnerById(id);
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
}

// Renvoie tous les partenaires
const getAllPartners = async (req, res, next) => {
  try {
    const partners = await PartnerServices.getAllPartners();
    res.status(200).json(partners);
  } catch (error) {
    next(error);
  }
}

// Met un jour un partenaire
const updatePartner = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const partner = await PartnerServices.updatePartner(id, data);
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
}

// Supprime un partenaire
const deletePartner = async (req, res, next) => {
  try {
    const id = req.params.id;
    const partner = await PartnerServices.deletePartner(id);
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
}

// Export des fonctions
export default {
  createPartner,
  getPartnerById,
  getAllPartners,
  updatePartner,
  deletePartner
};
