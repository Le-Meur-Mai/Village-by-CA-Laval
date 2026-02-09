import BaseModel from "./BaseModel.js";
import validator from "validator";

export default class User extends BaseModel {
  constructor({name, email, password, quotes = []}) {
    super();
    this.name = name;
    this.isAdmin = false;
    this.email = email;
    this.password = password;
    this.quotes = quotes;
  }

  set name(value) {
    if (typeof value !== "string") {
      throw new TypeError("Name must be a string.");
    }
    else if (value.length > 50) {
      throw new Error("The length of the name is too long.");
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set email(value) {
    if (typeof value !== "string") {
      throw new TypeError("Email must be a string.");
    }
    else if (validator.isEmail(value) === false) {
      throw new Error("Email has a wrong format.")
    }
    else if (value.length > 100) {
      throw new Error("The length of the email is too long.");
    }
    this._email = value;
  }

  get email() {
    return this._email;
  }
}
