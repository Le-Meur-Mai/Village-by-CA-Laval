// Import des services que l'on va appeler dans les controllers
import EventServices from '../services/eventServices.js';
// Import les fonction de formattage des données pour le return
import EventReturn from '../utils/returnFormat/eventReturn.js';

// Déclaration d'une nouvelle instance sur la classe Service
const servicesEvent = new EventServices();

// Crée un nouvel évènement
// On renvoie le résultat du service, sinon l'erreur est prise en charge par le errorHandler automatiquement
const createEvent = async (req, res, next) => {
  try {
    const data = req.body;
    const newEvent = await servicesEvent.createEvent({
      title: data.title,
      description: data.description,
      color: data.color,
      /* FullCalendar renvoie une string ISO, on le transforme en objet Date.
      Le format ISO est une forme de date claire et compréhensible par toutes
      les machines : 2024-03-20T14:30:00Z année-mois-jour-séparateur-
      heure, minutes, secondes-fuseau horaire*/
      date: new Date(data.date)
    });
    res.status(201).json({newEvent});
  } catch (error) {
    next(error)
  }
}

// Renvoie un évènement
const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await servicesEvent.getEventById(id);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}

// Renvoie tous les évènements
const getAllEvents = async (req, res, next) => {
  try {
    let allEvents = await servicesEvent.getAllEvents();
    allEvents = EventReturn.getAllEvents(allEvents);
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
    if (data.date) {
      data.date = new Date(data.date);
    }
    const updatedEvent = await servicesEvent.updateEvent(id, data);
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
}

// Supprime un évènement
const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedEvent = await servicesEvent.deleteEvent(id);
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