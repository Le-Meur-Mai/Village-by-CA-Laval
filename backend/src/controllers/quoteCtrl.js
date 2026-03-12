// Importation des services
import QuoteServices from "../services/quoteServices.js";
// Importation des fonctions de formatage
import quoteReturn from "../utils/returnFormat/quoteReturn.js";

// Controleur pour les citations
const servicesQuote = new QuoteServices();

// Création d'une citation
const createQuote = async (req, res, next) => {
  try {
    let owner = req.user.id
    if (req.user.isAdmin) {
      owner = req.body.userId;
    }
    let newQuote = await servicesQuote.createQuote({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      description: req.body.description,
      userId: owner
    })
    if (req.user.isAdmin) {
      newQuote = quoteReturn.getQuoteDetailsFormatAdmin(newQuote);
    } else {
      newQuote = quoteReturn.getQuoteDetailsFormat(newQuote);
    }
    res.status(201).json({
      message: `La citation de ${newQuote.firstName} a été créé.`,
      quote: newQuote});
  } catch (error) {
    next(error);
  }
}

// Retourne une citation par rapport à son ID
const getQuoteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let quote = await servicesQuote.getQuoteById(id);
    quote = quoteReturn.getQuoteDetailsFormat(quote);
    res.status(200).json(quote);
  } catch (error) {
    next(error);
  }
}

// Retourne toutes les citations
const getAllQuotes = async (req, res, next) => {
  try {
    let quotes = await servicesQuote.getAllQuotes();
    quotes = quoteReturn.getAllQuotesFormat(quotes);
    res.status(200).json(quotes);
  } catch (error) {
    next(error);
  }
}

// Met à jour une citation
const updateQuote = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const id = req.params.id;
    const newData = req.body;
    const updatedQuote = await servicesQuote.updateQuote(id, newData, currentUser);
    res.status(200).json(`La citation de ${updatedQuote.firstName} a été mise à jour.`);
  } catch (error) {
    next(error);
  }
}

// Suppression d'une citation
const deleteQuote = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const id = req.params.id;
    const deletedQuote = await servicesQuote.deleteQuote(id, currentUser);
    res.status(200).json(`La citation de ${deletedQuote.firstName} a été supprimée.`);
  } catch (error) {
    next(error);
  }
}

// Exportation des fonctions
export default {
  createQuote,
  getQuoteById,
  getAllQuotes,
  updateQuote,
  deleteQuote
}
