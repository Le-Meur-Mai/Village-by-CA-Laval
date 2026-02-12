export default class PartnerRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPartnerDefault(data) {
    const { logoId, ...partnerData } = data;

    const partner = await this.prisma.partner.create({
      data: {
        ...partnerData,
        logo: {
          connect: {id: logoId}
        }
      },
      include: {
        logo: true
      }
    });
    return partner;
  }

  async createPartnerCustom(data) {
    const { logo, ...partnerData } = data;
    const partner = await this.prisma.partner.create({
      data: {
        ...partnerData,
        logo: {
          create: {
            name: logo.name,
            path: logo.path
          }
        }
      },
      include: {
        logo: true
      }
    });
    return partner;
  }

  async findPartnerById(id) {
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
