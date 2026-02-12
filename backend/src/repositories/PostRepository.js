export default class PostRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPost(data) {
    const post = await this.prisma.post.create({
      data,
      include: {
        picture: true
      }
    });
    return post;
  }

  async getPostById(id) {
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
