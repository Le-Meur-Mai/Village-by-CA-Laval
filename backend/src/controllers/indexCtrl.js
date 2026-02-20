// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices.js";
import QuoteServices from "../services/quoteServices.js";
import PostServices from "../services/postServices.js";

const servicesStartUps = new StartUpServices()
const serviceQuotes = new QuoteServices()
const servicePosts = new PostServices()

const getIndex = async (req, res, next) => {
  try {
    const startUps = await servicesStartUps.getAllStartUps();
    const quotes = await serviceQuotes.getAllQuotes();
    const posts = await servicePosts.getAllPosts();
  
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
