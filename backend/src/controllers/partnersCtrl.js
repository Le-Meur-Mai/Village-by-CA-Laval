// Création des fonctions pour les routes Partenaires

const getAllPartners = (req, res) => {
  res.json({message: 'Page Partenaires'});
};

const getPartnerByID = (req, res) => {
  // Enregistre l'id dans la variable id
  const id = req.params.id;
  res.json({partenaireID: id});
};

// Export des fonctions
export default {
  getAllPartners,
  getPartnerByID
};
