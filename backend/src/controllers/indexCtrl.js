// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices.js";
import QuoteServices from "../services/quoteServices.js";
import PostServices from "../services/postServices.js";

// Importation des fonctions de formatage
import startupReturn from "../utils/returnFormat/startupReturn.js";
import quoteReturn from "../utils/returnFormat/quoteReturn.js";
import postReturn from "../utils/returnFormat/postReturn.js";

// Déclaration de nouvelles instances sur les classes Services
const servicesStartUps = new StartUpServices()
const serviceQuotes = new QuoteServices()
const servicePosts = new PostServices()

const getIndex = async (req, res, next) => {
  try {
    let startUps = await servicesStartUps.getAllStartUps();
    startUps = startupReturn.getAllStartUpsIndexFormat(startUps);
    let quotes = await serviceQuotes.getAllQuotes();
    quotes = quoteReturn.getAllQuotesFormat(quotes);
    let posts = await servicePosts.getAllPosts();
    posts = postReturn.getAllPostsFormat(posts);
  
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
