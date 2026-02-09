import BaseModel from "./BaseModel.js";

export default class Quote extends BaseModel {
  constructor({firstName, lastName, description, userId, user = null}) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.description = description;
    this.userId = userId;
    this.user = user;
  }

  set firstName(value) {
    if (typeof value !== "string") {
      throw new TypeError("First Name must be a string.");
    }
    else if (value.length > 20) {
      throw new Error("The length of the first name is too long.");
    }
    this._firstName = value;
  }
  
  get firstName() {
    return this._firstName;
  }

  set lastName(value) {
    if (typeof value !== "string") {
      throw new TypeError("Last name must be a string.");
    }
    else if (value.length > 20) {
      throw new Error("The length of the last name is too long.");
    }
    this._lastName = value;
  }
  
  get lastName() {
    return this._lastName;
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
  
  get description() {
    return this._description;
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
}
