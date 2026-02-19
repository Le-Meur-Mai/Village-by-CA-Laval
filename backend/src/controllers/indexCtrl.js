// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices";
import QuoteServices from "../services/quoteServices";
import PostServices from "../services/postServices";

const getIndex = async (req, res, next) => {
  try {
    const startUps = StartUpServices.getAllStartUps();
    const quotes = QuoteServices.getAllQuotes();
    const posts = PostServices.getAllPosts();
  
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
