import EventRepository from "../repositories/EventRepository.js";
import Event from "../classes/Event.js";
import prisma from "../prismaClient.js";
// importation de l'instance du prisma client
import * as Errors from "../errors/errorsClasses.js";
// importation de toutes nos classes d'erreurs personnalisées

export default class EventServices {
  constructor() {
    this.eventRepo = new EventRepository(prisma);
  }

  async createEvent (data) {
    try {
      new Event(data);
      return await this.eventRepo.createEvent(data);
    } catch (error) {
      throw error;
    }
  }

  async getEventById (id) {
    try {
      const event = await this.eventRepo.getEventById(id);
      if (!event) {
        throw new Errors.NotFoundError("Event doesn't exist.");
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllEvents () {
    try {
      return await this.eventRepo.getAllEvents();
    } catch (error) {
      throw error;
    }
  }

  async updateEvent (id, data) {
    try {
      const existingEvent = await this.eventRepo.getEventById(id);
      if (!existingEvent) {
        throw new Errors.NotFoundError("The event doesn't exist");
      }
      const newEvent = {...existingEvent, ...data};
      new Event(newEvent);
      return await this.eventRepo.updateEvent(id, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent (id) {
    try {
      const existingEvent = await this.eventRepo.getEventById(id);
      if (!existingEvent) {
        throw new Errors.NotFoundError("The event doesn't exist");
      }
      return await this.eventRepo.deleteEvent(id);
    } catch (error) {
      throw error;
    }
  }
}
