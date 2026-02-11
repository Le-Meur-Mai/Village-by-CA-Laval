export default class StartUpRepository{

  constructor(prisma){
    this.prisma = prisma;
  }

  async createStartUp(data) {
    const {descriptionPictureId, logoId, userId, types, ...dataStartUp} = data;
    const newStartUp = this.prisma.startUp.create({
      data: {
        ...dataStartUp,
        descriptionPicture: {
          connect:{ id: descriptionPictureId }
        },
        logo: {
          connect: { id: logoId }
        },
        user: {
          connect: { id: userId }
        },
        types: {
          connect: types?.map(type => ({
            id: type.id
          }))
        }
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

  async getStartUpById(id) {
    const startUp = this.prisma.startUp.findUnique({
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

  async getAllStartUps() {
    const allStartUps = this.prisma.startUp.findMany({
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return allStartUps;
  }

  async updateStartUp(id, data) {
    const startUp = this.prisma.startUp.update({
      where: { id },
      data,
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true,
      }
    });
    return startUp;

  }

  async deleteStartUp(id) {
    const startUp = this.prisma.startUp.delete({
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