// Import de BaseModel pour hériter de ses méthodes
import BaseModel from "./BaseModel.js";
// Import de la classe erreur renvoyant des erreurs personnalisées
import * as Errors from "../errors/errorsClasses.js"

export default class Partner extends BaseModel {
  constructor({name, description, website, financialAid, logoId, logo = null}) {
    super();
    this.name = name;
    this.description = description;
    this.website = website;
    this.financialAid = financialAid;
    this.logoId = logoId;
    this.logo = logo;
  }

  set name(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Name must be a string.");
    }
    else if (value.length > 100) {
      throw new Errors.ValidationError("The length of the name is too long.");
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set description(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Description must be a string.");
    }
    else if (value.length > 200) {
      throw new Errors.ValidationError("The length of the description is too long.");
    }
    this._description = value;
  }

  set website(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("Website must be a string.");
    }
    else if (value.length > 200) {
      throw new Errors.ValidationError("The length of the website is too long.");
    }
    this._website = value;
  }

  get website() {
    return this._website;
  }

  set logoId(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("logoId must be a string.");
    }
    else if (value.length !== 36) {
      throw new Errors.ValidationError("logoId don't have the correct length.");
    }
    this._logoId = value;
  }

  get logoId() {
    return this._logoId;
  }
}
