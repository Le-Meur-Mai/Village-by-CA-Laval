// Module qui s'occupe de sélectionner les données à retourner d'un type

// Retourne les détails d'un type
function getTypeDetailsFormat (type) {
  try {
    return {
      name: type.name,
      color: type.color,
      startUps: type.startUps
    }
  } catch (error) {
    throw error;
  }
}

// Retourne tous les types existants
function getAllTypesFormat (types) {
  try {
    if (!types.length) {
      return [];
    } else {
      return types.map(type => ({
        id: type.id,
        name: type.name,
        color: type.color
      }));
    }
  } catch (error) {
    throw error;
  }
}

export default {
  getTypeDetailsFormat,
  getAllTypesFormat
}
