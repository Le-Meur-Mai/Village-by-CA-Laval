export default class PartnerRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPartner(data, client = this.prisma) {
    const partner = await client.partner.create({
      data,
      include: {
        logo: true
      }
    });
    return partner;
  }

  async getPartnerById(id, client = this.prisma) {
    const partner = await client.partner.findUnique({
      where: {id},
      include: {
        logo: true
      }
    });
    return partner;
  }

  async getAllPartners(client = this.prisma) {
    const partners = await client.partner.findMany({
      include: {
        logo: true
      }
    });
    return partners;
  }

  async updatePartner(id, data, client = this.prisma) {
    const partner = await client.partner.update({
      where: {id},
      data,
      include: {
        logo: true
      }
    });
    return partner;
  }

  async deletePartner(id, client = this.prisma) {
    const partner = await client.partner.delete({
      where: {id},
      include: {
        logo: true
      }
    });
    return partner
  }
}
