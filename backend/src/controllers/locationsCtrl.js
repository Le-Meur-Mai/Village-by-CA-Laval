import LocationServices from "../services/locationServices.js";
import jsonParse from "../utils/jsonParse.js";

// Fonctions pour les routes locations

const servicesLocation = new LocationServices();

const createLocation = async (req, res, next) => {
  try {
    req.body.price = jsonParse(req.body.price);
    req.body.size = jsonParse(req.body.size);
    const newLocation = await servicesLocation.createLocation(
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        size: req.body.size,
        pictures: req.files
      }
    )
    res.status(201).json(newLocation);
  } catch (error) {
    next(error);
  }
}

// Retourne une location par rapport à son Id
const getLocationById = async (req, res, next) => {
  try {
    // Enregistre l'id dans la variable id
    const id = req.params.id;
    const location = await servicesLocation.getLocationById(id);
    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
}

// Retourne toutes les locations
const getAllLocations = async (req, res, next) => {
  try {
    const allLocations = await servicesLocation.getAllLocations()
    res.status(200).json(allLocations);
  } catch (error) {
    next(error);
  }
}

// Met à jour les locations
const updateLocation = async (req, res, next) => {
  try {
    req.body.price = jsonParse(req.body.price);
    req.body.size = jsonParse(req.body.size);
    req.body.pictures = jsonParse(req.body.pictures);
    const id = req.params.id;
    const newData = req.body;
    newData.newPictures = req.files;
    // On récupère les nouvelles images
    newData.newPictures = req.files;
    const updatedLocation = await servicesLocation.updateLocation(id, newData);
    res.status(200).json(updatedLocation);
  } catch (error) {
    next(error);
  }
}

// Supprime les locations
const deleteLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedLocation = await servicesLocation.deleteLocation(id);
    res.status(200).json(deletedLocation);
  } catch (error) {
    next(error);
  }
}


// Export des fonctions
export default {
  createLocation,
  getLocationById,
  getAllLocations,
  updateLocation,
  deleteLocation
}
