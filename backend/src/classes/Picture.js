import BaseModel from "./BaseModel.js";

export default class Picture extends BaseModel {
  constructor({name, path, locations = [], logoPartner = [], descriptionPicture = [], logoStartUp = [], post = null}) {
    super();
    this.name = name;
    this.path = path;
    this.locations = locations;
    this.logoPartner = logoPartner;
    this.descriptionPicture = descriptionPicture;
    this.logoStartUp = logoStartUp;
    this.post = post;
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

  set path(value) {
    if (typeof value !== "string") {
      throw new TypeError("Path must be a string.");
    }
    else if (value.length > 200) {
      throw new Error("The length of the path is too long.");
    }
    this._path = value;
  }

  get path() {
    return this._path;
  }

  set locations(value) {
    if (Array.isArray(value) !== true) {
      throw new TypeError("Locations must be an array.");
    }
    this._locations = value;
  }

  get locations() {
    return this._locations;
  }

  set logoPartner(value) {
    if (Array.isArray(value) !== true) {
      throw new TypeError("LogoPartner must be an array.");
    }
    this._logoPartner = value;
  }

  get logoPartner() {
    return this._logoPartner;
  }

  set descriptionPicture(value) {
    if (Array.isArray(value) !== true) {
      throw new TypeError("DescriptionPicture must be an array.");
    }
    this._descriptionPicture = value;
  }

  get descriptionPicture() {
    return this._descriptionPicture;
  }

  set logoStartUp(value) {
    if (Array.isArray(value) !== true) {
      throw new TypeError("LogoStartUp must be an array.");
    }
    this._logoStartUp = value;
  }

  get logoStartUp() {
    return this._logoStartUp;
  }
}
