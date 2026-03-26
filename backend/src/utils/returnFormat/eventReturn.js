// Module qui s'occupe de sélectionner les données que les évènements vont retourner

// Retourne tous les évenements

function getAllEvents (events) {
  try {
    if (!events.length) {
      return [];
    } else {
      return events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.date,
        color: event.color
      }));
    }
  } catch (error) {
    return error;
  }
}

export default {
  getAllEvents
}