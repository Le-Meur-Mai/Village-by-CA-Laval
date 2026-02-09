import BaseModel from "./BaseModel.js";

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
      throw new TypeError("Name must be a string.");
    }
    else if (value.length > 100) {
      throw new Error("The length of the name is too long.");
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set description(value) {
    if (typeof value !== "string") {
      throw new TypeError("Description must be a string.");
    }
    else if (value.length > 200) {
      throw new Error("The length of the description is too long.");
    }
    this._description = value;
  }

  set website(value) {
    if (typeof value !== "string") {
      throw new TypeError("Website must be a string.");
    }
    else if (value.length > 200) {
      throw new Error("The length of the website is too long.");
    }
    this._website = value;
  }

  get website() {
    return this._website;
  }

  set logoId(value) {
    if (typeof value !== "string") {
      throw new TypeError("logoId must be a string.");
    }
    else if (value.length !== 36) {
      throw new Error("logoId don't have the correct length.");
    }
    this._logoId = value;
  }

  get logoId() {
    return this._logoId;
  }
}
