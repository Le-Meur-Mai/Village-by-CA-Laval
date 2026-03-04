// Importation du base model pour created at et update at
import BaseModel from "./BaseModel.js";
// Importation du validateur de format d'email
import validator from "validator";
// Importation des erreurs
import * as Errors from "../errors/errorsClasses.js";

export default class ContactForm extends BaseModel {
  constructor ({email = "", subject = "", message = ""}) {
    super();
    this.email = email;
    this.subject = subject;
    this.message = message;
  }

  set email(value) {
      if (typeof value !== "string") {
        throw new Errors.ValidationError("Email must be a string");
      }
      else if (validator.isEmail(value) === false) {
        throw new Errors.ValidationError("Email has a wrong format");
      }
      this._email = value;
    }
  
  get email() {
    return this._email;
  }

  set subject(value) {
      if (typeof value !== "string") {
        throw new Errors.ValidationError("Subject must be a string.");
      }
      else if (value.length > 200 || value.length < 1) {
        throw new Errors.ValidationError("The length of the subject is too long or too short.");
      }
      this._subject = value;
    }
  
  get subject() {
    return this._subject;
  }

  set message(value) {
      if (typeof value !== "string") {
        throw new Errors.ValidationError("Message must be a string.");
      }
      else if (value.length > 200 || value.length < 10) {
        throw new Errors.ValidationError("The length of the message is too long or too short.");
      }
      this._message = value;
    }
  
  get message() {
    return this._message;
  }

}
