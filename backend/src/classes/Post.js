import BaseModel from "./BaseModel.js";
import * as Errors from "../errors/errorsHandler.js"

export default class Post extends BaseModel {
  constructor({title, description, pictureId, picture = null}) {
    super();
    this.title = title;
    this.description = description;
    this.pictureId = pictureId;
    this.picture = null;
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
    else if (value.length > 5000) {
      throw new Errors.ValidationError("The length of the description is too long.");
    }
    this._description = value;
  }

  set pictureId(value) {
    if (typeof value !== "string") {
      throw new Errors.ValidationError("PictureId must be a string.");
    }
    else if (value.length !== 36) {
      throw new Errors.ValidationError("PictureId don't have the correct length.");
    }
    this._pictureId = value;
  }

  get pictureId() {
    return this._pictureId;
  }
}