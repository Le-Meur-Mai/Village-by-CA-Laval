import bcrypt from "bcrypt";
import * as Errors from "../errors/errorsClasses.js";
/* Module qui va hasher le mdp pour ne pas l'avoir en clair dans la DB. */

/* Rappel: Un salt est une suite de caractères générée aléatoirement qui se
rajoute au mot de passe de base que l'on va hasher avec le mdp.*/

// Correspond à la complexité du hashage, 10 est le standard.
const saltRounds = 10;

async function hashPassword(plainTextPassword) {
  try {
    return await bcrypt.hash(plainTextPassword, saltRounds);
  } catch (error) {
    throw new Errors.ValidationError("Hash Password Error");
  }
}

export default hashPassword;
