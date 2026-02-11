export default class PictureRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPicture(data) {
    const picture = await this.prisma.picture.create({data});
    return picture;
  }

  async findPictureById(id) {
    const picture = await this.prisma.picture.findUnique({
      where: {id},
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        locations: true
      }
    });
    return picture;
  }

  async getAllPictures() {
    const pictures = await this.prisma.picture.findMany({
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        locations: true
      }
    });
    return pictures;
  }

  async updatePicture(id, data) {
    const picture = await this.prisma.picture.update({
      where: {id},
      data,
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        locations: true
      }
    });
    return picture;
  }

  async deletePicture(id) {
    const picture = await this.prisma.picture.delete({
      where: {id},
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        locations: true
      }
    });
    return picture;
  }
}
