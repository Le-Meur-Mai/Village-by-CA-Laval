export default class PostRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPost(data) {
    const {picture, ...postData} = data;
    const post = await this.prisma.post.create({
      data: {
      ...postData,
      // creer une image dans la table picture si la propriete picture a ete renseignee sinon ne fait rien
      ...(picture && {
        picture: {
          create: {
            name: picture.name,
            path: picture.path
          }
        }
      })
      },
      include: {
        picture: true
      }
    });
    return post;
  }

  async findPostById(id) {
    const post = await this.prisma.post.findUnique({
      where: {id},
      include: {
        picture: true
      }
    });
    return post;
  }

  async getAllPost() {
    const posts = await this.prisma.post.findMany({
      include: {
        picture: true
      }
    });
    return posts;
  }

  async updatePost(id, data) {
    const post = await this.prisma.post.update({
      where: {id},
      data,
      include: {
        picture: true
      }
    });
    return post;
  }

  async deletePost(id) {
    const post = await this.prisma.post.delete({
      where: {id},
      include: {
        picture: true
      }
    });
    return post
  }
}
