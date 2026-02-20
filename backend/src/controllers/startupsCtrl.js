// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices.js";

// Déclaration d'une nouvelle instance sur la classe Service
const servicesStartUp = new StartUpServices();

// Fonctions pour les routes Startups

const createStartUp = async (req, res, next) => {
  try {
    const startUpCreated = await servicesStartUp.createStartUp(
      {
        name: req.body.name,
        description: req.body.name,
        isAlumni: req.body.isAlumni,
        website: req.body.website,
        userId: req.body.userId,
        logo: req.body.logo,
        descriptionPicture: req.body.descriptionPicture,
        types: req.body.types
      });
      res.status(201).json(startUpCreated);
  } catch (error) {
    next(error);
  }
}

const getStartupById = async (req, res, next) => {
  // Enregistre l'id dans la variable id
  try {
    const id = req.params.id;
    const startUp = await servicesStartUp.getStartUpById(id);
    res.status(200).json(startUp);
  } catch (error) {
    next(error);
  }
}

const getAllStartups = async (req, res, next) => {
  try {
    const startUps = await servicesStartUp.getAllStartups();
    res.status(200).json(startUps);
  } catch (error) {
    next(error);
  }
}

const updateStartUp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedStartUp = await servicesStartUp.updateStartUp(id, newData);
    res.status(200).json(updatedStartUp);
  } catch (error) {
    next(error);
  }
}

const deleteStartUp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedStartUp = await servicesStartUp.deleteStartUp(id);
    res.status(200).json(deletedStartUp);
  } catch (error) {
    next(error);
  }
}
// Export des fonctions
export default {
  createStartUp,
  getStartupById,
  getAllStartups,
  updateStartUp,
  deleteStartUp
}
