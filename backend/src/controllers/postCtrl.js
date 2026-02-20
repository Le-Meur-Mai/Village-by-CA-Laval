import PostServices from "../services/postServices.js";

const servicesPost = new PostServices();

// Création d'un post
const createPost = async (req, res, next) => {
  try {
    const newPost = await servicesPost.createPost({
      title: req.body.title,
      description: req.body.description,
      picture: req.body.picture
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
}

// Retourne un post par son Id
const getPostById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await servicesPost.getPostById(id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

// Retourne tous les posts
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await servicesPost.getAllPosts();
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
    const updatedPost = await servicesPost.updatePost(id, data);
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
}

// Supression d'un post
const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedPost = await servicesPost.deletePost(id);
    res.status(200).json(deletedPost);
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
