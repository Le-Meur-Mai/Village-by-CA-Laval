// Module qui s'occupe de sélectionner les données à retourner d'un utilisateur

// Retourne le profil complet d'un utilisateur
function getUserProfile (existingUser) {
  try {
    const profile = {
            user: {name: existingUser.name, email: existingUser.email}
          };
          if (existingUser.startUp) {
            profile.startUp = {
              id: existingUser.startUp.id,
              name: existingUser.startUp.name,
              description: existingUser.startUp.description,
              isAlumni: existingUser.startUp.isAlumni,
              website: existingUser.startUp.website,
              logo: existingUser.startUp?.logo.secureUrl,
              descriptionPicture: existingUser.startUp.descriptionPicture.secureUrl,
              types: existingUser.startUp.types
            };
          } else {
            profile.startUp = null;
          }
          if (existingUser.quotes.length > 0) {
            profile.quotes = existingUser.quotes.map(quote => ({
              firstName: quote.firstName,
              lastName: quote.lastName,
              description: quote.description,
              id: quote.id
            }));
          } else {
            profile.quotes = [];
          }
          return profile;
  } catch (error) {
    throw error;
  }
}

// Retourne la liste des utilisateurs pour l'admin
function getAllUsersFormat (usersList) {
  try {
    if (!usersList.length) {
      return [];
    } else {
      return usersList.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        startUp: user.startup?.name
      }));
    }
  } catch (error) {
    throw error;
  }
}

export default {
  getAllUsersFormat,
  getUserProfile
}