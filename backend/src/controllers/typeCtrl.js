// Import des services que l'on va appeler dans les controllers
import TypeServices from '../services/typeServices.js';
// Import de la fonction utilitaire pour parser des champs
import jsonParse from "../utils/jsonParse.js";

// Déclaration d'une nouvelle instance sur la classe Service
const servicesType = new TypeServices();

// Crée un nouveau type
// On renvoie le résultat du service, sinon l'erreur est prise en charge par le errorHandler automatiquement
const createType = async (req, res, next) => {
  try {
    req.body.startUps = jsonParse(req.body.startUps);
    const data = req.body;
    const newType = await servicesType.createType({
      name: data.name,
      color: data.color,
      startUps: data.startUps
    });
    res.status(201).json(newType);
  } catch (error) {
    next(error);
  }
}

// Renvoie un type donné
const getTypeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const type = await servicesType.getTypeById(id);
    res.status(200).json(type);
  } catch (error) {
    next(error);
  }
}

// renvoie tous les types
const getAllTypes = async (req, res, next) => {
  try {
    const allTypes = await servicesType.getAllTypes();
    res.status(200).json(allTypes);
  } catch (error) {
    next(error);
  }
}

// Met à jour un type
const updateType = async (req, res, next) => {
  try {
    req.body.startUps = jsonParse(req.body.startUps);
    const id = req.params.id;
    const data = req.body;
    const updatedType = await servicesType.updateType(id, data);
    res.status(200).json(updatedType);
  } catch (error) {
    next(error);
  }
}

// Supprime un type
const deleteType = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedType = await servicesType.deleteType(id);
    res.status(200).json(deletedType);
  } catch (error) {
    next(error);
  }
}

// Export des controllers
export default {
  createType,
  getTypeById,
  getAllTypes,
  updateType,
  deleteType
}