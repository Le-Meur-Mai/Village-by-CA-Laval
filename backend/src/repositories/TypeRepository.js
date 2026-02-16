export default class TypeRepository{
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createType(data) {
    const {startUps, ...dataType} = data;
    const newType = await this.prisma.type.create({
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
  
  async getAllTypes() {
    const allTypes = await this.prisma.type.findMany({
      include: {startUps: true}
    });
    return allTypes;
  }
  
  async getTypeById(id) {
    const type = await this.prisma.type.findUnique({
      where: {id},
      include: {startUps: true}
    });
    return type;
  }
  
  async updateType(id, data) {
    const {startUps, ...dataType} = data;
    const type = await this.prisma.type.update({
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
  
  async deleteType(id) {
    const type = await this.prisma.type.delete({
       where: {id: id},
       include: {
        startUps: true
       }
    });
    return type;
  }
}
