import EventRepository from "../repositories/EventRepository.js";
import Event from "../classes/Event.js";
import validFields from "../utils/validFields.js";
import prisma from "../prismaClient.js";
// importation de l'instance du prisma client
import * as Errors from "../errors/errorsClasses.js";
// importation de toutes nos classes d'erreurs personnalisées

const allowedFields = ["title", "description", "color", "date"];

export default class EventServices {
  constructor() {
    this.eventRepo = new EventRepository(prisma);
  }

  async createEvent (data) {
    try {
      validFields(data, allowedFields);
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
        throw new Errors.NotFoundError("L'évènement n'existe pas.");
      }
      return event;
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
        throw new Errors.NotFoundError("L'évènement n'existe pas.");
      }
      validFields(data, allowedFields);
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
        throw new Errors.NotFoundError("L'évènement n'existe pas.");
      }
      return await this.eventRepo.deleteEvent(id);
    } catch (error) {
      throw error;
    }
  }

  /* On va créer une nouvelle date à chaque début de mois pour supprimer tous
  les évements qui sont avant. */
  async cleanupOldEvents() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.eventRepo.deleteBefore(firstDayOfMonth);
  }
}
