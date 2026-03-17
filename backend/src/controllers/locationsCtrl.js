// importation des services
import LocationServices from "../services/locationServices.js";
// importation de la fonction pour parser le json en objet js
import jsonParse from "../utils/jsonParse.js";
// Importation des fonctions de formatage
import locationReturn from "../utils/returnFormat/locationReturn.js";

// Fonctions pour les routes locations

const servicesLocation = new LocationServices();

const createLocation = async (req, res, next) => {
  try {
    req.body.price = jsonParse(req.body.price);
    req.body.size = jsonParse(req.body.size);
    let newLocation = await servicesLocation.createLocation(
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        size: req.body.size,
        pictures: req.files
      }
    )
    newLocation = locationReturn.getLocationDetailsFormat(newLocation);
    res.status(201).json({message: `La location ${newLocation.title} a été créée.`,
      newLocation}
    );
  } catch (error) {
    next(error);
  }
}

// Retourne une location par rapport à son Id
const getLocationById = async (req, res, next) => {
  try {
    // Enregistre l'id dans la variable id
    const id = req.params.id;
    let location = await servicesLocation.getLocationById(id);
    location = locationReturn.getLocationDetailsFormat(location);
    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
}

// Retourne toutes les locations
const getAllLocations = async (req, res, next) => {
  try {
    let locations = await servicesLocation.getAllLocations();
    locations = locationReturn.getAllLocationsFormat(locations);
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
}

// Met à jour les locations
const updateLocation = async (req, res, next) => {
  try {
    // On parse que si les données existent
    ["price", "size", "pictures"].forEach(key => {
      if (req.body[key]) {
        req.body[key] = jsonParse(req.body[key]);
      }
    });
    const id = req.params.id;
    const newData = req.body;
    // On récupère les nouvelles images
    newData.newPictures = req.files;
    let updatedLocation = await servicesLocation.updateLocation(id, newData);
    updatedLocation = locationReturn.getLocationDetailsFormat(updatedLocation);
    res.status(200).json({message: `La location ${updatedLocation.title} a été mise à jour.`,
      updatedLocation});
  } catch (error) {
    next(error);
  }
}

// Supprime les locations
const deleteLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const location = await servicesLocation.deleteLocation(id);
    res.status(200).json({message:`La location ${location.title} a été suprimée .`,
      location}
    );
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
