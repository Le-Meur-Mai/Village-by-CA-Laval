export default class QuoteRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createQuote(data) {
    const quote = await this.prisma.quote.create({
      data,
      include: {
        user: true
      }
    });
    return quote;
  }

  async getQuoteById(id) {
    const quote = await this.prisma.quote.findUnique({
      where: {id},
      include: {
        user: true
      }
    });
    return quote;
  }

  async getQuotesByUser(id) {
    const quotes = await this.prisma.quote.findMany({
      where: {userId: id},
      include: {
        user: true
      }
    });
    return quotes;
  }

  async getAllQuotes() {
  const quotes = await this.prisma.quote.findMany({
    include: {
      user: true
    }
  });
  return quotes;
  }

  async updateQuote(id, data) {
    const quote = await this.prisma.quote.update({
      where: {id},
      data,
      include: {
        user: true
      }
    });
    return quote;
  }

  async deleteQuote(id) {
    const quote = await this.prisma.quote.delete({
      where: {id},
      include: {
        user: true
      }
    });
    return quote;
  }
}
