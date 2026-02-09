import { v4 as uuidv4 } from "uuid";

export default class BaseModel {
  constructor() {
    if (new.target === BaseModel) {
      throw new Error('BaseModel is an abstract class and can\'t be instanciated');
    }
    this.id = uuidv4();
    const now = new Date(); //Pour que update et create est la meme date de base
    this.createdAt = now;
    this.updatedAt = now;
  }

  update() {
    this.updatedAt = new Date();
  }
}
