// Import de BaseModel pour hériter de ses méthodes
import BaseModel from "./BaseModel.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"

export default class Quote extends BaseModel {
  constructor({firstName, lastName, description, userId, user = null}) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.description = description;
    this.userId = userId;
    this.user = user;
  }

  set firstName(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Le prénom doit être une chaîne de caractères.");
    }
    else if (value.length > 20 || value.length < 1) {
      throw new Errors.ValidationError("La longueur du prénom est trop petite ou trop longue.");
    }
    this._firstName = value;
  }
  
  get firstName() {
    return this._firstName;
  }

  set lastName(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Le nom de famille doit être une chaîne de caractères.");
    }
    else if (value.length > 20 || value.length < 1) {
      throw new Errors.ValidationError("La longueur du nom de famille est trop petite ou trop longue.");
    }
    this._lastName = value;
  }
  
  get lastName() {
    return this._lastName;
  }

  set description(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("La description doit être une chaîne de caractères.");
    }
    else if (value.length > 200 || value.length < 10) {
      throw new Errors.ValidationError("La description est trop courte ou trop longue.");
    }
    this._description = value;
  }
  
  get description() {
    return this._description;
  }

  set userId(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("UserId must be a string.");
    }
    else if (value.length !== 36) {
      throw new Errors.ValidationError("UserId don't have the correct length.");
    }
    this._userId = value;
  }

  get userId() {
    return this._userId;
  }
}
