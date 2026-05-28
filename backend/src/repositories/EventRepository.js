export default class EventRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createEvent(data, client = this.prisma) {
    const event = await client.event.create({data});
    return event;
  }

  async getEventById(id, client = this.prisma) {
    const event = await client.event.findUnique({
      where: {id}
    });
    return event;
  }

  // On retourne des évenements sur trois mois
  async getAllEvents(client = this.prisma) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 3, 0);
    const events = await client.event.findMany({
      where: {
      date: {
        gte: start,
        lte: end
      }
      },
      orderBy: { date: "asc" }
    });
    return events;
  }

  async updateEvent(id, data, client = this.prisma) {
    const event = await client.event.update({
      where: {id},
      data
    });
    return event;
  }

  async deleteEvent(id, client = this.prisma) {
    const event = await client.event.delete({
      where: {id}
    });
    return event;
  }

  // lt = Less Than
  async deleteBefore(date, client = this.prisma) {
    const events = await client.event.deleteMany({
      where: {
        date: { lt: date },
      },
    });
    return events;
  }
}
