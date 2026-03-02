// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices.js";
// Import de la fonction utilitaire pour parser des champs
import jsonParse from "../utils/jsonParse.js";
// Importation des fonctions pour gérer le format renvoyé
import startupReturn from "../utils/returnFormat/startupReturn.js";

// Déclaration d'une nouvelle instance sur la classe Service
const servicesStartUp = new StartUpServices();

// Fonctions pour les routes Startups

const createStartUp = async (req, res, next) => {
  try {
    // Postman envoie toujours des strings, on le parse pour le convertir en objet js
    req.body.types = jsonParse(req.body.types);
    req.body.isAlumni = jsonParse(req.body.isAlumni);

    const startUpCreated = await servicesStartUp.createStartUp(
      {
        name: req.body.name,
        description: req.body.description,
        isAlumni: req.body.isAlumni,
        website: req.body.website,
        userId: req.body.userId,
        logo: req.files?.logo?.[0],
        descriptionPicture: req.files?.descriptionPicture?.[0],
        types: req.body.types
      });
      res.status(201).json(`La startup ${startUpCreated.name} a été créée.`);
  } catch (error) {
    next(error);
  }
}

const getStartUpById = async (req, res, next) => {
  // Enregistre l'id dans la variable id
  try {
    const id = req.params.id;
    let startUp = await servicesStartUp.getStartUpById(id);
    startUp = startupReturn.getStartupDetailsFormat(startUp);
    res.status(200).json(startUp);
  } catch (error) {
    next(error);
  }
}

const getAllStartUps = async (req, res, next) => {
  try {
    let startUps = await servicesStartUp.getAllStartUps();
    startUps = startupReturn.getAllStartUpsFormat(startUps);
    res.status(200).json(startUps);
  } catch (error) {
    next(error);
  }
}

const updateStartUp = async (req, res, next) => {
  try {
    const currentUser = req.user
    // Postman envoie toujours des strings, on le parse pour le convertir en objet js
    req.body.types = jsonParse(req.body.types);
    req.body.isAlumni = jsonParse(req.body.isAlumni);

    const id = req.params.id;
    const newData = req.body;
    newData.logo = req.files?.logo?.[0];
    newData.descriptionPicture = req.files?.descriptionPicture?.[0];
    const updatedStartUp = await servicesStartUp.updateStartUp(id, newData, currentUser);
    res.status(200).json(`La startup ${updatedStartUp.name} a été mise à jour.`);
  } catch (error) {
    next(error);
  }
}

const deleteStartUp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedStartUp = await servicesStartUp.deleteStartUp(id);
    res.status(200).json(`La startup ${deletedStartUp.name} a été supprimée.`);
  } catch (error) {
    next(error);
  }
}
// Export des fonctions
export default {
  createStartUp,
  getStartUpById,
  getAllStartUps,
  updateStartUp,
  deleteStartUp
}
