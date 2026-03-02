// Importation des services
import PostServices from "../services/postServices.js";
// Importations des fonctions de formatage
import postReturn from "../utils/returnFormat/postReturn.js";

const servicesPost = new PostServices();

// Création d'un post
const createPost = async (req, res, next) => {
  try {
    const newPost = await servicesPost.createPost({
      title: req.body.title,
      description: req.body.description,
      picture: req.file
    });
    res.status(201).json(`Le post ${newPost.title} a été créé.`);
  } catch (error) {
    next(error);
  }
}

// Retourne un post par son Id
const getPostById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let post = await servicesPost.getPostById(id);
    post = postReturn.getPostDetailsFormat(post);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

// Retourne tous les posts
const getAllPosts = async (req, res, next) => {
  try {
    let posts = await servicesPost.getAllPosts();
    posts = postReturn.getAllPostsFormat(posts);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

// Mise à jour d'un post
const updatePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    data.picture = req.file;
    const updatedPost = await servicesPost.updatePost(id, data);
    res.status(200).json(`Le post ${updatedPost.title} a été mis à jour.`);
  } catch (error) {
    next(error);
  }
}

// Supression d'un post
const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedPost = await servicesPost.deletePost(id);
    res.status(200).json(`Le post ${deletedPost.title} a été supprimé.`);
  } catch (error) {
    next(error);
  }
}

export default {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost
}
