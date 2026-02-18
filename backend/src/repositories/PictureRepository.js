export default class PictureRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPicture(data, client = this.prisma) {
    const picture = await client.picture.create({data});
    return picture;
  }

  async getPictureById(id, client = this.prisma) {
    const picture = await client.picture.findUnique({
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

  async updatePicture(id, data, client = this.prisma) {
    const picture = await client.picture.update({
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

  async deletePicture(id, client = this.prisma) {
    const picture = await client.picture.delete({
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
