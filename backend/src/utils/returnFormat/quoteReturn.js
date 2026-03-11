// Module qui s'occupe de sélectionner les données que les citations vont retourner

// Retourne les détails d'une citation
function getQuoteDetailsFormat (quote) {
  try {
    return {
      id: quote.id,
      logo: quote.user.startUp?.logo?.secureUrl,
      startUp: quote.user.startUp?.name,
      firstName: quote.firstName,
      lastName: quote.lastName,
      description: quote.description
    };
  } catch (error) {
    throw error;
  }
}

// Retourne toutes les quotes
function getAllQuotesFormat (quotes) {
  try {
    if (!quotes.length) {
      return [];
    } else {
      return quotes.map(quote => ({
        id: quote.id,
        startUp: {
          name: quote.user.startUp?.name,
          logo: quote.user.startUp?.logo.secureUrl
        },
        firstName: quote.firstName,
        lastName: quote.lastName,
        description: quote.description
      }));
    }
  } catch (error) {
    return error;
  }
}

export default {
  getQuoteDetailsFormat,
  getAllQuotesFormat
}