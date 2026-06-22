// Import des services que l'on va appeler dans les controllers
import StartUpServices from "../services/startUpServices.js";
import QuoteServices from "../services/quoteServices.js";
import PostServices from "../services/postServices.js";
import EventServices from "../services/eventServices.js";

// Importation des fonctions de formatage
import startupReturn from "../utils/returnFormat/startupReturn.js";
import quoteReturn from "../utils/returnFormat/quoteReturn.js";
import postReturn from "../utils/returnFormat/postReturn.js";
import EventReturn from '../utils/returnFormat/eventReturn.js';
import eventReturn from "../utils/returnFormat/eventReturn.js";

// Déclaration de nouvelles instances sur les classes Services
const servicesStartUps = new StartUpServices();
const serviceQuotes = new QuoteServices();
const servicePosts = new PostServices();
const serviceEvents = new EventServices();

const getIndex = async (req, res, next) => {
  try {
    let startUps = await servicesStartUps.getAllStartUps();
    startUps = startupReturn.getAllStartUpsIndexFormat(startUps);
    let quotes = await serviceQuotes.getAllQuotes();
    quotes = quoteReturn.getAllQuotesFormat(quotes);
    let posts = await servicePosts.getTwoRecentPosts();
    posts = postReturn.getAllPostsFormat(posts);
    let events = await serviceEvents.getAllEvents();
    events = eventReturn.getAllEvents(events);
  
    res.status(200).json({
      startUps: startUps,
      quotes: quotes,
      posts: posts,
      events: events
    });
  } catch (error) {
    next(error);
  }
};

// Export des fonctions
export default {
  getIndex
};
