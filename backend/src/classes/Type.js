// Import de BaseModel pour hériter de ses méthodes
import BaseModel from "./BaseModel.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsHandler.js"

export default class Type extends BaseModel {
  constructor({name, color, startUps = []}) {
    super();
    this.name = name;
    this.color = color;
    this.startUps = startUps;
  }

  set name(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Name must be a string.");
    }
    else if (value.length > 30) {
      throw new Errors.ValidationError("Name is too long.");
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set color(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Color must be a string.");
    }
    else if (value.length !== 6) {
      throw new Errors.ValidationError("Color must be composed of 6 characters.");
    }
    this._color = value;
  }

  get color() {
    return this._color;
  }

  set startUps(value) {
    if (Array.isArray(value) !== true) {
      throw new Errors.ValidationError("StartUps must be an array.");
    }
    this._startUps = value;
  }

  get startUps() {
    return this._startUps;
  }
}
