import StartUpServices from "../services/startUpServices.js";

// Fonctions pour les routes Startups

const createStartUp = async (req, res, next) => {
  try {
    const startUpCreated = await StartUpServices.createStartUp(
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
    const startUp = await StartUpServices.getStartUpById(id);
    res.status(200).json(startUp);
  } catch (error) {
    next(error);
  }
}

const getAllStartups = async (req, res, next) => {
  try {
    const startUps = await StartUpServices.getAllStartups();
    res.status(200).json(startUps);
  } catch (error) {
    next(error);
  }
}

const updateStartUp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedStartUp = await StartUpServices.updateStartUp(id, newData);
    res.status(200).json(updatedStartUp);
  } catch (error) {
    next(error);
  }
}

const deleteStartUp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedStartUp = await StartUpServices.deleteStartUp(id);
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
