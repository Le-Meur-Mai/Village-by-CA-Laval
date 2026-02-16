export default class LocationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createLocation(data) {
    const {pictures, ...dataLocation} = data;
    const location = await this.prisma.location.create({
      data: {
        ...dataLocation,
        pictures: {
          connect: pictures.map(id => ({ id }))
        }
      },
      include: {
        pictures: true
      }
    });
    return location;
  }

  async getLocationById(id) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        pictures: true
      }
    });
    return location;
  }

  async getAllLocations() {
    const allLocations = await this.prisma.location.findMany({
      include: {
        pictures: true
      }
    });
    return allLocations;
  }

  async updateLocation(id, data) {
    const {pictures, ...dataLocation} = data;
    const updatedLocation = await this.prisma.location.update({
      where: { id },
      data: {
        ...dataLocation,
        pictures: pictures.map(id => ({ id }))
      },
      include: {
        pictures: true
      }
    });
    return updatedLocation;
  }

  async deleteLocation(id) {
    const deletedLocation = await this.prisma.location.delete({
      where: { id },
      include: {
        pictures: true
      }
    });
    return deletedLocation;
  }

}