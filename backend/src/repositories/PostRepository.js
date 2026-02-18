export default class PostRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPost(data, client = this.prisma) {
    const post = await client.post.create({
      data,
      include: {
        picture: true
      }
    });
    return post;
  }

  async getPostById(id, client = this.prisma) {
    const post = await client.post.findUnique({
      where: {id},
      include: {
        picture: true
      }
    });
    return post;
  }

  async getAllPost(client = this.prisma) { 
    const posts = await client.post.findMany({
      include: {
        picture: true
      }
    });
    return posts;
  }

  async updatePost(id, data, client = this.prisma) {
    const post = await client.post.update({
      where: {id},
      data,
      include: {
        picture: true
      }
    });
    return post;
  }

  async deletePost(id, client = this.prisma) {
    const post = await client.post.delete({
      where: {id},
      include: {
        picture: true
      }
    });
    return post
  }
}
