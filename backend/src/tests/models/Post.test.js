import Post from "../../classes/Post.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("Post Model", () => {

  const validData = {
    title: "My first post",
    description: "This is a detailed description of the post content.",
    pictureId: "1234-picture-id",
    picture: "image.png"
  };

  // ---------------------------------------------------------
  // 1. Création valide
  // ---------------------------------------------------------
  test("should create a valid Post instance", () => {
    const post = new Post(validData);

    expect(post.title).toBe(validData.title);
    expect(post.description).toBe(validData.description);
    expect(post.pictureId).toBe(validData.pictureId);
    expect(post.picture).toBe(validData.picture);
  });

  // ---------------------------------------------------------
  // 2. Tests title
  // ---------------------------------------------------------
  test("should throw if title is not a string", () => {
    expect(() => new Post({...validData, title: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if title is too short", () => {
    expect(() => new Post({...validData, title: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if title is too long", () => {
    const longTitle = "a".repeat(101);
    expect(() => new Post({...validData, title: longTitle}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 3. Tests description
  // ---------------------------------------------------------
  test("should throw if description is not a string", () => {
    expect(() => new Post({...validData, description: false}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too short", () => {
    expect(() => new Post({...validData, description: "short"}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too long", () => {
    const longDesc = "a".repeat(5001);
    expect(() => new Post({...validData, description: longDesc}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 4. Tests pictureId
  // ---------------------------------------------------------
  test("should throw if pictureId is not a string", () => {
    expect(() => new Post({...validData, pictureId: 42}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept an empty string as pictureId", () => {
    const post = new Post({...validData, pictureId: ""});
    expect(post.pictureId).toBe("");
  });

  test("should accept any string as pictureId", () => {
    const post = new Post({...validData, pictureId: "abc"});
    expect(post.pictureId).toBe("abc");
  });

});
