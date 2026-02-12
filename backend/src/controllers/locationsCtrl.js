// Fonctions pour les routes locations

const getAllLocations = (req, res) => {
  res.json({message: 'Page Locations'});
};

const getLocationByID = (req, res) => {
  // Enregistre l'id dans la variable id
  const id = req.params.id;
  res.json({locationID: id});
};

// Export des fonctions
export default {
  getAllLocations,
  getLocationByID
};
