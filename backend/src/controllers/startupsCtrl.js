// Fonctions pour les routes Startups

const getAllStartups = (req, res) => {
  res.json({message: 'Page Startups'});
};

const getStartupByID = (req, res) => {
  // Enregistre l'id dans la variable id
  const id = req.params.id;
  res.json({startupID: id});
};

// Export des fonctions
export default {
  getAllStartups,
  getStartupByID
};
