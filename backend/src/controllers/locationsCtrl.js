import LocationServices from "../services/locationServices.js"

// Fonctions pour les routes locations

const createLocation = async (req, res, next) => {
  try {
    const newLocation = await LocationServices.createLocation(
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        size: req.body.size,
        pictures: req.body.pictures
      }
    )
    res.status(200).json(newLocation);
  } catch (error) {
    next(error);
  }
};

// Retourne une location par rapport à son Id
const getLocationByID = async (req, res, next) => {
  try {
    // Enregistre l'id dans la variable id
    const id = req.params.id;
    const location = await LocationServices.getLocationByID(id);
    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
};

// Retourne toutes les locations
const getAllLocations = async (req, res, next) => {
  try {
    const allLocations = await LocationServices.getAllLocations()
    res.status(200).json(allLocations);
  } catch (error) {
    next(error);
  }
};

// Met à jour les locations
const updateLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedLocation = await LocationServices.updateLocation(id, newData);
    res.status(200).json(updatedLocation);
  } catch (error) {
    next(error);
  }
}

// Supprime les locations
const deleteLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedLocation = await LocationServices.deleteLocation(id);
    res.status(200).json(deletedLocation);
  } catch (error) {
    next(error);
  }
}


// Export des fonctions
export default {
  createLocation,
  getLocationByID,
  getAllLocations,
  updateLocation,
  deleteLocation
};
