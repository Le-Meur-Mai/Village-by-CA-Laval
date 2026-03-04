// Module qui s'occupe de sélectionner les données que les startups vont retourner

// Retourne les détails d'une startUp
function getStartupDetailsFormat (startUp) {
  try {
    return {
      name: startUp.name,
      logo: startUp.logo.secureUrl,
      email: startUp.user.email,
      website: startUp.website,
      types: startUp.types.map(type => ({
        name: type.name,
        color: type.color,
        id: type.id
      })),
      descriptionPicture: startUp.descriptionPicture.secureUrl,
      description: startUp.description
    }
    
  } catch (error) {
    throw error;
  }
}

// Retourne toutes les startups
function getAllStartUpsFormat (startUpsList) {
  try {
    if (!startUpsList.length) {
      return [];
    }
    return startUpsList.map(startup => ({
      id: startup.id,
      name: startup.name,
      logo: startup.logo.secureUrl,
      isAlumni: startup.isAlumni,
      description: startup.description,
      types: startup.types.map(type => ({
        id: type.id,
        name: type.name,
        color: type.color
      }))
    })); 
  } catch (error) {
    throw error;
  }
}

// Retourne les logos de toutes les startups pour la page d'accueil
function getAllStartUpsIndexFormat (startUps) {
  try {
    if (!startUps.length) {
      return [];
    } else {
      return startUps.map(startUp => ({
        id: startUp.id,
        logo: startUp.logo.secureUrl
      }));
    }
  } catch (error) {
    throw error;
  }
}

export default {
  getStartupDetailsFormat,
  getAllStartUpsFormat,
  getAllStartUpsIndexFormat
}