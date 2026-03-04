// Importation des classes repository pour post et picture
import PostRepository from "../repositories/PostRepository.js";
import PictureRepository from "../repositories/PictureRepository.js";
// importation de la classe post
import Post from "../classes/Post.js";
// importation de l'instance du prisma client
import prisma from "../prismaClient.js";
// importation de toutes nos classes d'erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js";
// Import de la fonction cloudinary pour envoyer les images sur l'hébergeur
import uploadPictureToCloudinary from "../utils/uploadToCloudinary.js";
// Importation de la config Cloudinary pour pouvoir supprimer des images
import cloudinary from "../../config/cloudinary.js";

export default class PostServices {
  constructor() {
    this.postRepo = new PostRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  // POST Création d'un post
  async createPost (data) {
    let uploadPicture = null;
    try {
      return await prisma.$transaction(async (tx) => {
        if (data.picture) {
          // Création de l'image dans Cloudinary
          uploadPicture = await uploadPictureToCloudinary(data.picture, "Posts");
          const newPicture = {
            secureUrl: uploadPicture.secure_url,
            publicId: uploadPicture.public_id
          }
          // Création de l'image dans la db
          const newPicturePost = await this.pictureRepo.createPicture(newPicture, tx);
          data.pictureId = newPicturePost.id;
          delete data.picture;
        }
        new Post(data);
        return await this.postRepo.createPost(data, tx);
      })
    } catch (error) {
      if (uploadPicture) {
        await cloudinary.uploader.destroy(uploadPicture.public_id);
      }
      throw error;
    }
  }

  // GET Retourne un post grâce à son id
  async getPostById (id) {
    try {
      const post = await this.postRepo.getPostById(id);
      if (!post) {
        throw new Errors.NotFoundError("The post doesn't exist");
      }
      return post;
    } catch (error) {
      throw error;
    }
  }

  // GET Retourne tous les posts existants
  async getAllPosts () {
    try {
      return await this.postRepo.getAllPost();
    } catch (error) {
      return error;
    }
  }

  // PATCH Mise à jour d'un post
  async updatePost (id, data) {
    // On met une variable en dehors du catch pour être reconnue par catch si elle est modifié
    let uploadPicture = null;
    try {
      return await prisma.$transaction(async (tx) => {
        // On vérifie que le post existe
        const existingPost = await this.postRepo.getPostById(id, tx);
        if (!existingPost) {
          throw new Errors.NotFoundError("The post doesn't exist.");
        }
  
        // On cree une nouvelle image s'il y en a une et on va suprimmer l'ancienne
        if (data.picture) {
          uploadPicture = await uploadPictureToCloudinary(data.picture, "Posts");
          const newPicture = {
            secureUrl: uploadPicture.secure_url,
            publicId: uploadPicture.public_id
          }
          // On l'enregistre dans Cloudinary puis on l'enregistre dans la db
          const newPicturePost = await this.pictureRepo.createPicture(newPicture, tx);

          data.pictureId = newPicturePost.id;
          delete data.picture;
          // On met l'Id de la nouvelle image dans les données de mise à jour
        }
        const fullPost = {...existingPost, ...data};
        // On fusionne les nouvelles et anciennes données
        new Post(fullPost);
        // On vérifie le format
        const newPost = await this.postRepo.updatePost(id, data, tx);

        // On supprime l'ancienne photo s'il y en a une
        if (uploadPicture && existingPost.picture && existingPost.picture.id !== "Id par defaut") {
          await cloudinary.uploader.destroy(existingPost.picture.publicId);
          await this.pictureRepo.deletePicture(existingPost.picture.id, tx);
        }

        return newPost;
      })
    } catch (error) {
      if (uploadPicture) {
        // On supprime la nouvelle image si le reste de l'opération échoue
        await cloudinary.uploader.destroy(uploadPicture.public_id);
      }
      throw error;
    }
  }

  // DELETE Suppression d'un post existant
  async deletePost(id) {
    try {
      return await prisma.$transaction(async (tx) => {
        const post = await this.postRepo.getPostById(id, tx);
        if (!post) {
          throw new Errors.NotFoundError("The post doesn't exist");
        }
        if (post.pictureId && post.pictureId !== "Id par defaut" && post.picture) {
          // On supprime l'image de Cloudinary et de notre DB
          await cloudinary.uploader.destroy(post.picture.publicId);
          await this.pictureRepo.deletePicture(post.pictureId, tx);
        }
        return await this.postRepo.deletePost(id, tx);
      })
    } catch (error) {
      throw error;
    }
  }
}
