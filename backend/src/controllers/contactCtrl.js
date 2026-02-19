// Import des services que l'on va appeler dans les controllers
import ContactServices from "../services/contactServices";

const postContact = async (req, res, next) => {
  try {
    const message = req.body;
    const contact = await ContactServices.postContact(message);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// Export des fonctions
export default {
  postContact
};