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

  async getAllEvents(client = this.prisma) {
    const events = await client.event.findMany({});
    return events;
  }

  async getEventByDate(date, client = this.prisma) {
    const events = await client.event.findMany({
      where: {date}
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
}
