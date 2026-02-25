// Import de BaseModel pour hériter de ses méthodes
import BaseModel from "./BaseModel.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"

export default class Location extends BaseModel {
  constructor({title, description, price, size, pictures = []}) {
    super();
    this.title = title;
    this.description = description;
    this.price = price;
    this.size = size;
    this.pictures = pictures;
  }

  set title(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Title must be a string.");
    }
    else if (value.length > 100) {
      throw new Errors.ValidationError("The length of the title is too long.");
    }
    this._title = value;
  }

  get title() {
    return this._title;
  }

  set description(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Description must be a string.");
    }
    else if (value.length > 800) {
      throw new Errors.ValidationError("The length of the description is too long.");
    }
    this._description = value;
  }

  set price(value) {
    if (typeof value !== "number") {
      throw new Errors.ValidationError("Price must be a number.");
    }
    else if (value < 0) {
      throw Errors.ValidationError("Price must be positive");
    }
    this._price = value;
  }

  get price() {
    return this._price;
  }

  set size(value) {
    if (typeof value !== "number") {
      throw new Errors.ValidationError("Size must be a number.");
    }
    else if (value < 0) {
      throw Errors.ValidationError("Size must be positive");
    }
    this._size = value;
  }

  get size() {
    return this._size;
  }

  set pictures(value) {
  if (!Array.isArray(value)) {
    throw new Errors.ValidationError("Pictures must be an array.");
  }
  this._pictures = value;
}


  get pictures() {
    return this._pictures;
  }
}
