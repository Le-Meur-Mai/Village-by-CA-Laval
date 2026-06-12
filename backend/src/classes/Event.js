// Import de BaseModel pour hériter de ses méthodes
import BaseModel from "./BaseModel.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"

export default class Event extends BaseModel {
  constructor({title, description = "", color, date = new Date()}) {
    super();
    this.title = title;
    this.description = description;
    this.color = color;
    this.date = date;
  }

  set title(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Le titre doit être une chaîne de caractères");
    }
    else if (value.length > 80 || value.length < 1) {
      throw new Errors.ValidationError("Le titre est trop long ou trop court.");
    }
    this._title = value;
  }

  get title() {
    return this._title;
  }

  set description(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("La description doit être un chaîne de caractères.");
    }
    else if (value.length > 200) {
      throw new Errors.ValidationError("La longueur de la description est trop longue");
    }
    this._description = value;
  }

  set color(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("La couleur doit être une chaîne de caractères");
    }
    else if (value.length !== 7) {
      throw new Errors.ValidationError("La couleur doit contenir un code hexadécimal.");
    }
    this._color = value;
  }

  get color() {
    return this._color;
  }

  set date(value) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Dernier jour du mois + 2 mois
    const lastAllowedDay = new Date(now.getFullYear(), now.getMonth() + 3, 0);

    if (value instanceof Date !== true) {
      throw new Errors.ValidationError("La date doit être une instance de Date.");
    }
    else if (firstDayOfMonth > value) {
      throw new Errors.ValidationError("La date est antérieure au mois actuel.");
    }
    else if (value > lastAllowedDay) {
      throw new Errors.ValidationError("La date dépasse la limite de trois mois.");
    }
    
    this._date = value;
  }

  get date() {
    return this._date;
  }
}
