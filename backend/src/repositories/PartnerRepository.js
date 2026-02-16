export default class PartnerRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPartner(data) {
    const partner = await this.prisma.partner.create({
      data,
      include: {
        logo: true
      }
    });
    return partner;
  }

  async getPartnerById(id) {
    const partner = await this.prisma.partner.findUnique({
      where: {id},
      include: {
        logo: true
      }
    });
    return partner;
  }

  async getAllPartners() {
    const partners = await this.prisma.partner.findMany({
      include: {
        logo: true
      }
    });
    return partners;
  }

  async updatePartner(id, data) {
    const partner = await this.prisma.partner.update({
      where: {id},
      data,
      include: {
        logo: true
      }
    });
    return partner;
  }

  async deletePartner(id) {
    const partner = await this.prisma.partner.delete({
      where: {id},
      include: {
        logo: true
      }
    });
    return partner
  }
}
