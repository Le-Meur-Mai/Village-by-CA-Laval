export default class TypeRepository{
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createType(data, client = this.prisma) {
    const {startUps, ...dataType} = data;
    const newType = await client.type.create({
      data: {
        ...dataType,
        startUps: startUps ? {
          connect: startUps.map(id => ({ id }))
        } : undefined
      },
      include: {
        startUps: true
      }
    });
    return newType;
  }
  
  async getAllTypes(client = this.prisma) {
    const allTypes = await client.type.findMany({
      include: {startUps: true}
    });
    return allTypes;
  }
  
  async getTypeById(id, client = this.prisma) {
    const type = await client.type.findUnique({
      where: {id},
      include: {startUps: true}
    });
    return type;
  }
  
  async updateType(id, data, client = this.prisma) {
    const {startUps, ...dataType} = data;
    const type = await client.type.update({
      where: {id: id},
      data: {
        ...dataType,
        startUps: startUps ? {
          connect: startUps.map(id => ({ id }))
        } : undefined
      },
      include: {
        startUps: true
      }
    });
    return type;
  }
  
  async deleteType(id, client = this.prisma) {
    const type = await client.type.delete({
       where: {id: id},
       include: {
        startUps: true
       }
    });
    return type;
  }
}
