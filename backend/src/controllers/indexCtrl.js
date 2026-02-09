// Création des fonctions pour la route index

const getIndex = (req, res) => {
  res.json({message: 'Page Index'});
};

// Export des fonctions
export default {
  getIndex
};
