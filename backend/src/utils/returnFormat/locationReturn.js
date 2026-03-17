// Module qui s'occupe de sélectionner les données que les locations vont retourner

// Retourne les détails d'un location
function getLocationDetailsFormat (location) {
  try {
    return {
      id: location.id,
      title: location.title,
      pictures: location.pictures.map(picture => ({
        id: picture.id,
        secureUrl: picture.secureUrl
      })),
      price: location.price,
      size: location.size,
      description: location.description
    };
  } catch (error) {
    throw error;
  }
}

function getAllLocationsFormat (locations) {
  try {
    if (!locations.length) {
      return [];
    } else {
      return locations.map(location => ({
        id: location.id,
        title: location.title,
        picture: location.pictures?.[0].secureUrl,
        price: location.price,
        size: location.size
      }))
    }
  } catch (error) {
    return error;
  }
}

export default {
  getAllLocationsFormat,
  getLocationDetailsFormat
}
