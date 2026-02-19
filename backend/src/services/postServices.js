import PostRepository from "../repositories/PostRepository.js";
import PictureRepository from "../repositories/PictureRepository.js";
// Importation des classes repository pour post et picture
import Post from "../classes/Post.js";
import Picture from "../classes/Picture.js";
// importations des classes post et picture
import prisma from "../prismaClient.js";
// importation de l'instance du prisma client
import * as Errors from "../errors/errorsHandler.js";
// importation de toutes nos classes d'erreurs personnalisées

export default class PostServices {
  constructor() {
    this.postRepo = new PostRepository(prisma);
    this.pictureRepo = new PictureRepository(prisma);
  }

  // POST Crétaion d'un post
  async createPost (data) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (data.picture) {
          new Picture(data.picture);
          const newPicturePost = await this.pictureRepo.createPicture(data.picture, tx);
          data.pictureId = newPicturePost.id;
        }
        new Post(data);
        return await this.postRepo.createPost(data, tx);
      })
    } catch (error) {
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
    try {
      return await prisma.$transaction(async (tx) => {
        // On vérifie que le post existe
        const existingPost = await this.postRepo.getPostById(id, tx);
        if (!existingPost) {
          throw new Errors.NotFoundError("The post doesn't exist.");
        }
  
  
        // On cree une nouvelle image s'il y en a une et on va suprimmer l'ancienne
        let oldPicturePostId = null;
        if (data.picture) {
          new Picture(data.picture);
          const newPicturePost = await this.pictureRepo.createPicture(data.picture, tx);
          data.pictureId = newPicturePost.id;
          if (existingPost.pictureId) {
            oldPicturePostId = existingPost.pictureId;
          }
        }
        const fullPost = {...existingPost, ...data};
        // On fusionne les nouvelles et anciennes données
        new Post(fullPost);
  
        const newPost = await this.postRepo.updatePost(id, data, tx);

        if (oldPicturePostId && oldPicturePostId !== "Id par defaut") {
          await this.pictureRepo.deletePicture(oldPicturePostId, tx);
        }

        return newPost;
      })
    } catch (error) {
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
        if (post.pictureId && post.pictureId !== "Id par defaut") {
          await this.pictureRepo.deletePicture(post.pictureId, tx);
        }
        return await this.postRepo.deletePost(id, tx);
      })
    } catch (error) {
      throw error;
    }
  }
}
