import bcrypt from "bcrypt";
import * as Errors from "../errors/errorsClasses.js";
/*Module pour comparer le mot de passe rentré par l'utilisateur et celui
stocké en hash dans la base de données. */

// On compare le mdp de la requête au mdp hashé en DB avec Bcrypt
async function checkPassword(passwordEntered, existingPassword) {
  const match = await bcrypt.compare(passwordEntered, existingPassword);
  if (match) {
    return true;
  } else {
    throw new Errors.AuthentificationError("Wrong password");
  }
}

export default checkPassword;
