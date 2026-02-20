import QuoteServices from "../services/quoteServices.js";

// Controleur pour les citations

// Création d'une citation
const createQuote = async (req, res, next) => {
  try {
    const newQuote = await QuoteServices.createQuote({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      description: req.body.description,
      userId: req.body.userId
    })
    res.status(201).json(newQuote);
  } catch (error) {
    next(error);
  }
}

// Retourne une citation par rapport à son ID
const getQuoteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const quote = await QuoteServices.getQuoteById(id);
    res.status(200).json(quote);
  } catch (error) {
    next(error);
  }
}

// Retourne toutes les citations
const getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await QuoteServices.getAllQuotes();
    res.status(200).json(quotes);
  } catch (error) {
    next(error);
  }
}

// Met à jour une citation
const updateQuote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedQuote = await QuoteServices.updateQuote(id, newData);
    res.status(200).json(updatedQuote);
  } catch (error) {
    next(error);
  }
}

// Suppression d'une citation
const deleteQuote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedQuote = await QuoteServices.deleteQuote(id);
    res.status(200).json(deletedQuote);
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
