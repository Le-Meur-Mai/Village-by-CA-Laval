import BaseModel from "./BaseModel.js";

export default class StartUp extends BaseModel {
  constructor({name, description = "", isAlumni = false, website = "",
    userId, descriptionPictureId, logoId, user = null,
    descriptionPicture = null, logo = null, types = []}) {
    super();
    this.name = name;
    this.description = description;
    this.isAlumni = isAlumni;
    this.website = website;

    this.userId = userId;
    this.descriptionPictureId = descriptionPictureId;
    this.logoId = logoId;

    this.user = user;
    this.descriptionPicture = descriptionPicture;
    this.logo = logo;
    this.types = types; // Liste des objets pas des IDs
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
    else if (value.length > 300) {
      throw new Error("The length of the description is too long.");
    }
    this._description = value;
  }

  get description() {
    return this._description;
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

  set isAlumni(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("isAlumni value must be a boolean");
    }
    this._isAlumni = value;
  }

  get isAlumni() {
    return this._isAlumni;
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

  set descriptionPictureId(value) {
    if (typeof value !== "string") {
      throw new TypeError("DescriptionPictureId must be a string.");
    }
    else if (value.length !== 36) {
      throw new Error("DescriptionPictureId don't have the correct length.");
    }
    this._descriptionPictureId = value;
  }

  get descriptionPictureId() {
    return this._descriptionPictureId;
  }

  set userId(value) {
    if (typeof value !== "string") {
      throw new TypeError("UserId must be a string.");
    }
    else if (value.length !== 36) {
      throw new Error("UserId don't have the correct length.");
    }
    this._userId = value;
  }

  get userId() {
    return this._userId;
  }

  set types(value) {
    if (Array.isArray(value) !== true) {
      throw new TypeError("Types must be an array.");
    }
    this._types = value;
  }

  get types() {
    return this._types;
  }
}
