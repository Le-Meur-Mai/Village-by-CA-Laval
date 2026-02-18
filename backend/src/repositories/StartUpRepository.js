export default class StartUpRepository{

  constructor(prisma){
    this.prisma = prisma;
  }

  async createStartUp(data, client = this.prisma) {
    const {types, ...dataStartUp} = data;
    const newStartUp = client.startUp.create({
      data: {
        ...dataStartUp,
        types: types ? 
        {
          connect: types.map(id => ({ id }))
        } : undefined
      },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return newStartUp;
  }

  async getStartUpById(id, client = this.prisma) {
    const startUp = client.startUp.findUnique({
      where: { id },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return startUp;
  }

  async getAllStartUps(client = this.prisma) {
    const allStartUps = client.startUp.findMany({
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return allStartUps;
  }

  async updateStartUp(id, data, client = this.prisma) {
    const {types, ...dataStartUp} = data;
    const startUp = client.startUp.update({
      where: { id },
      data: {
        ...dataStartUp,
        types: types ? 
          {
            connect: types.map(id => ({ id }))
          } : undefined
      },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return startUp;
  }

  async deleteStartUp(id, client = this.prisma) {
    const startUp = client.startUp.delete({
      where: { id },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return startUp;
  }
}