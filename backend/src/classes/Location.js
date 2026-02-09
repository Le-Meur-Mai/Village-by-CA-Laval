import BaseModel from "./BaseModel.js";

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
      throw new TypeError("Title must be a string.");
    }
    else if (value.length > 100) {
      throw new Error("The length of the title is too long.");
    }
    this._title = value;
  }

  get title() {
    return this._title;
  }

  set description(value) {
    if (typeof value !== "string") {
      throw new TypeError("Description must be a string.");
    }
    else if (value.length > 800) {
      throw new Error("The length of the description is too long.");
    }
    this._description = value;
  }

  set price(value) {
    if (typeof value !== "number") {
      throw new TypeError("Price must be a number.");
    }
    else if (value < 0) {
      throw Error("Price must be positive");
    }
    this._price = value;
  }

  get price() {
    return this._price;
  }

  set size(value) {
    if (typeof value !== "number") {
      throw new TypeError("Size must be a number.");
    }
    else if (value < 0) {
      throw Error("Size must be positive");
    }
    this._size = value;
  }

  get size() {
    return this._size;
  }

  set pictures(value) {
    if (Array.isArray(value) !== true) {
      throw new TypeError("StartUps must be an array.");
    }
    this._pictures = value;
  }

  get pictures() {
    return this._pictures;
  }
}
