export default class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUser(data) {
    const user = await this.prisma.user.create({data});
    return user;
  }

  async findFullObjectUserById(id) {
    const user = await this.prisma.user.findUnique({
      where: {id},
      include : {
        quotes: true,
        startUp: true
      }
    });
    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        quotes: true,
        startUp: true
      }
    });
    return users;
  }

  async findUserByEmail(email) {
    const user = await this.prisma.user.findUnique({
      where: {email},
      include: {
        quotes: true,
        startUp: true
      }
    });
    return user;
  }

  async updateUser(id, data) {
    const user = await this.prisma.user.update({
    where: {id},
    data,
    include: {
      quotes: true,
      startUp: true
    }
  });
  return user;
  }

  async deleteUser(id) {
    const user = await this.prisma.user.delete({
      where: {id},
      include: {
        quotes: true,
        startUp: true
      }
    });
    return user;
  }
}
