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
          create: pictures?.map(pic => ({
            name: pic.name,
            path: pic.path
          }))
        }
        // ca cree des nouvelles images dans la table picture car la relation
        // est specifiee dans le schema.prisma
      },
      include: {
        pictures: true
      }
    });
    return location;
  }
}