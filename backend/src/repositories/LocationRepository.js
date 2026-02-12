export default class LocationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createLocation(data) {
    const {pictures, ...dataLocation} = data;
    const location = await this.prisma.location.create({
      data: {
        ...dataLocation,
        // Cree des nouvelles images dans la table picture car la relation
        // est specifiee dans le schema.prisma
        pictures: {
          create: pictures?.map(pic => ({
            name: pic.name,
            path: pic.path
          }))
        }
      },
      include: {
        pictures: true
      }
    });
    return location;
  }
}