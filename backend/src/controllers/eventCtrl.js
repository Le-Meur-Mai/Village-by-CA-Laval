// Import des services que l'on va appeler dans les controllers
import EventServices from '../services/eventServices.js';

// Crée un nouvel évènement
// On renvoie le résultat du service, sinon l'erreur est prise en charge par le errorHandler automatiquement
const createEvent = async (req, res, next) => {
  try {
    const data = req.body;
    const newEvent = await EventServices.createEvent({
      title: data.title,
      description: data.description,
      color: data.color,
      date: data.date
    });
    res.status(201).json(newEvent);
  } catch (error) {
    next(error)
  }
}

// Renvoie un évènement
const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await EventServices.getEventById(id);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}

// Renvoie tous les évènements
const getAllEvents = async (req, res, next) => {
  try {
    const allEvents = await EventServices.getAllEvents();
    res.status(200).json(allEvents);
  } catch (error) {
    next(error);
  }
}

// Met à jour un évènement
const updateEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedEvent = await EventServices.updateEvent(id, data);
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
}

// Supprime un évènement
const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedEvent = await EventServices.deleteEvent(id);
    res.status(200).json(deletedEvent);
  } catch (error) {
    next(error);
  }
}

// Export des controllers
export default {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent
}