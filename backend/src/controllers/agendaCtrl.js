// Importation des services necessaires
import PostServices from "../services/postServices.js";
import EventServices from "../services/eventServices.js";

// Importation des fonctions de formattage
import postReturn from "../utils/returnFormat/postReturn.js";
import eventReturn from "../utils/returnFormat/eventReturn.js";

// Déclaration de nouvelles instances sur les classes Services
const servicesPosts = new PostServices();
const servicesEvents = new EventServices();

const getAgenda = async (req, res, next) => {
  try {
    let allEvents = await servicesEvents.getAllEvents();
    allEvents = eventReturn.getAllEvents(allEvents);
    let posts = await servicesPosts.getAllPosts();
    posts = postReturn.getAllPostsFormat(posts);

    res.status(200).json({
      events: allEvents,
      posts: posts
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAgenda
};
