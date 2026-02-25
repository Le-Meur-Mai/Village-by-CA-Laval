export default class LocationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Méthode create, utilise soit le client prisma, soit la transaction fournie
  async createLocation(data, client = this.prisma) {
    const {pictures, ...dataLocation} = data;
    const location = await client.location.create({
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

  async getLocationById(id, client = this.prisma) {
    const location = await client.location.findUnique({
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

  async updateLocation(id, data, client = this.prisma) {
    const {pictures, ...dataLocation} = data;
    const updatedLocation = await client.location.update({
      where: { id },
      data: {
        ...dataLocation,
        pictures: {
          set: pictures.map(id => ({ id }))
        }
      },
      include: {
        pictures: true
      }
    });
    return updatedLocation;
  }

  async deleteLocation(id, client = this.prisma) {
    const deletedLocation = await client.location.delete({
      where: { id },
      include: {
        pictures: true
      }
    });
    return deletedLocation;
  }

}