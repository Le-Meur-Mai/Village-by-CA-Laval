/*Fonction pour parser les dataform de Postman pour transformer les string
envoyées en objet js. Exemple: on va recevoir '[]' -> le transforme en vrai tableau*/

function jsonParse (reqBody) {
  try {
    if (typeof reqBody === "string") {
      return JSON.parse(reqBody);
    } else {
      return reqBody;
    }
  } catch {
    return reqBody;
  }
}

export default jsonParse;
