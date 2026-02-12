export default class EventRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createEvent(data) {
    const event = await this.prisma.event.create({data});
    return event;
  }

  async getEventById(id) {
    const event = await this.prisma.event.findUnique({
      where: {id}
    });
    return event;
  }

  async getAllEvent() {
    const events = await this.prisma.event.findMany({});
    return events;
  }

  async getEventByDate(date) {
    const events = await this.prisma.event.findMany({
      where: {date}
    });
    return events;
  }

  async updateEvent(id, data) {
    const event = await this.prisma.event.update({
      where: {id},
      data
    });
    return event;
  }

  async deleteEvent(id) {
    const event = await this.prisma.event.delete({
      where: {id}
    });
    return event;
  }
}
