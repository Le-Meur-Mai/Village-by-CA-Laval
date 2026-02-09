import BaseModel from "./BaseModel.js";

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
      throw new TypeError("Title must be a string.");
    }
    else if (value.length > 80) {
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
    else if (value.length > 200) {
      throw new Error("The length of the description is too long.");
    }
    this._description = value;
  }

  set color(value) {
    if (typeof value !== "string") {
      throw new TypeError("Color must be a string.");
    }
    else if (value.length !== 6) {
      throw new Error("Color must be composed of 6 characters.");
    }
    this._color = value;
  }

  get color() {
    return this._color;
  }

  set date(value) {
    if (value instanceof Date !== true) {
      throw new TypeError("date must be an instance of Date.");
    }
    else if (new Date() > value) {
      throw Error("The date has passed.");
    }
    this._date = value;
  }

  get date() {
    return this._date;
  }
}
