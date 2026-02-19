export default class QuoteRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createQuote(data, client = this.prisma) {
    const quote = await client.quote.create({
      data,
      include: {
        user: true
      }
    });
    return quote;
  }

  async getQuoteById(id, client = this.prisma) {
    const quote = await client.quote.findUnique({
      where: {id},
      include: {
        user: true
      }
    });
    return quote;
  }

  async getQuotesByUser(id, client = this.prisma) {
    const quotes = await client.quote.findMany({
      where: {userId: id},
      include: {
        user: true
      }
    });
    return quotes;
  }

  async getAllQuotes(client = this.prisma) {
  const quotes = await client.quote.findMany({
    include: {
      user: true
    }
  });
  return quotes;
  }

  async updateQuote(id, data, client = this.prisma) {
    const quote = await client.quote.update({
      where: {id},
      data,
      include: {
        user: true
      }
    });
    return quote;
  }

  async deleteQuote(id, client = this.prisma) {
    const quote = await client.quote.delete({
      where: {id},
      include: {
        user: true
      }
    });
    return quote;
  }
}
