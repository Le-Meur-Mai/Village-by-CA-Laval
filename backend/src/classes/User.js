// Import de BaseModel pour hériter de ses méthodes
import BaseModel from "./BaseModel.js";
// Import du module de validation d'email
import validator from "validator";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"

export default class User extends BaseModel {
  constructor({name, email, password, quotes = [], startUp = null}) {
    super();
    this.name = name;
    this.isAdmin = false;
    this.email = email;
    this.password = password;
    this.quotes = quotes;
    this.startUp = startUp;
  }

  set name(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Name must be a string");
    }
    else if (value.length > 50) {
      throw new Errors.ValidationError("The length of the name is too long");
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set email(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Email must be a string");
    }
    else if (validator.isEmail(value) === false) {
      throw new Errors.ValidationError("Email has a wrong format")
    }
    else if (value.length > 100) {
      throw new Errors.ValidationError("The length of the email is too long");
    }
    this._email = value;
  }

  get email() {
    return this._email;
  }

  set password(value) {
    if (typeof value !== 'string') {
      throw new Errors.ValidationError('The password must be a string');
    }
    else if (value.length < 10) {
      throw new Errors.ValidationError('The password is too short');
    } 
    else if (value.length > 255) {
      throw new Errors.ValidationError('The password is too long');
    }
    this._password = value;
  }

  get password() {
    return this._password;
  }
}
