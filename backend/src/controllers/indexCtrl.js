// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices";
import QuoteServices from "../services/quoteServices";
import PostServices from "../services/postServices";

const getIndex = async (req, res, next) => {
  try {
    const startUps = await StartUpServices.getAllStartUps();
    const quotes = await QuoteServices.getAllQuotes();
    const posts = await PostServices.getAllPosts();
  
    res.status(200).json({
      startups: startUps,
      quotes: quotes,
      posts: posts
    });
  } catch (error) {
    next(error);
  }
};

// Export des fonctions
export default {
  getIndex
};
