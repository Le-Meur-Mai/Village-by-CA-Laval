export default class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUser(data, client = this.prisma) {
    const user = await client.user.create({
      data,
    include: {
      quotes: true,
      startUp: true
    }});
    return user;
  }

  async getUserById(id, client = this.prisma) {
    const user = await client.user.findUnique({
      where: {id},
      include : {
        quotes: true,
        startUp: true
      }
    });
    return user;
  }

  async getAllUsers(client = this.prisma) {
    const users = await client.user.findMany({
      include: {
        quotes: true,
        startUp: true
      }
    });
    return users;
  }

  async findUserByEmail(email, client = this.prisma) {
    const user = await client.user.findUnique({
      where: {email},
      include: {
        quotes: true,
        startUp: true
      }
    });
    return user;
  }

  async updateUser(id, data, client = this.prisma) {
    const user = await client.user.update({
    where: {id},
    data,
    include: {
      quotes: true,
      startUp: true
    }
  });
  return user;
  }

  async deleteUser(id, client = this.prisma) {
    const user = await client.user.delete({
      where: {id},
      include: {
        quotes: true,
        startUp: true
      }
    });
    return user;
  }
}
