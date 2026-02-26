// Import des services que l'on va appeler dans les controllers
import contactServices from "../services/contactServices.js";

// Déclaration d'une nouvelle instance sur la classe Service
const servicesContact = new contactServices();

const sendMail = async (req, res, next) => {
  try {
    await servicesContact.sendMail(req.body);
    res.status(200).json("Mail envoyé !");
  } catch (error) {
    next(error);
  }
};

// Export des fonctions
export default {
  sendMail
};
