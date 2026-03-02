// Module qui s'occupe de sélectionner les données que les partenaires vont retourner

// Retourne les détails d'un partenaire
function getPartnerDetailsFormat (partner) {
  try {
    return {
      name: partner.name,
      logo: partner.logo.secureUrl,
      description: partner.description,
      website: partner.website,
      financialAid: partner.financialAid
    }
  } catch (error) {
    throw error;
  }
}

// Retourne tous les partenaires pour le site vitrine
function getAllPartnersFormat (partnersList) {
  try {
    if (!partnersList.length) {
      return [];
    } else {
      return partnersList.map(partner => ({
        id: partner.id,
        name: partner.name,
        logo: partner.logo.secureUrl,
        description: partner.description,
        website: partner.website,
        financialAid: partner.financialAid
      }));
    }
  } catch (error) {
    throw error;
  }
}

export default {
  getPartnerDetailsFormat,
  getAllPartnersFormat
}
