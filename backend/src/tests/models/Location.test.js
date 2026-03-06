import Location from "../../classes/Location.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("Location Model", () => {

  // -----------------------------
  // VALID CREATION
  // -----------------------------
  test("should create a valid Location instance", () => {
    const loc = new Location({
      title: "Nice apartment",
      description: "A beautiful apartment located downtown.",
      price: 12.00,
      size: 45,
      pictures: ["img1.jpg", "img2.jpg"]
    });

    expect(loc.title).toBe("Nice apartment");
    expect(loc.description).toBe("A beautiful apartment located downtown.");
    expect(loc.price).toBe(12.00);
    expect(loc.size).toBe(45);
    expect(loc.pictures).toEqual(["img1.jpg", "img2.jpg"]);
  });

  // -----------------------------
  // TITLE TESTS
  // -----------------------------
  test("should throw if title is not a string", () => {
    expect(() => new Location({
      title: 123,
      description: "Valid description",
      price: 100,
      size: 20
    })).toThrow(Errors.ValidationError);
  });

  test("should throw if title is too short or too long", () => {
    expect(() => new Location({
      title: "",
      description: "Valid description",
      price: 100,
      size: 20
    })).toThrow(Errors.ValidationError);

    expect(() => new Location({
      title: "a".repeat(101),
      description: "Valid description",
      price: 100,
      size: 20
    })).toThrow(Errors.ValidationError);
  });

  // -----------------------------
  // DESCRIPTION TESTS
  // -----------------------------
  test("should throw if description is not a string", () => {
    expect(() => new Location({
      title: "Valid",
      description: 123,
      price: 100,
      size: 20
    })).toThrow(Errors.ValidationError);
  });

  test("should throw if description length is invalid", () => {
    expect(() => new Location({
      title: "Valid",
      description: "short",
      price: 100,
      size: 20
    })).toThrow(Errors.ValidationError);

    expect(() => new Location({
      title: "Valid",
      description: "a".repeat(801),
      price: 100,
      size: 20
    })).toThrow(Errors.ValidationError);
  });

  // -----------------------------
  // PRICE TESTS
  // -----------------------------
  test("should throw if price is not a number", () => {
    expect(() => new Location({
      title: "Valid",
      description: "Valid description",
      price: "100",
      size: 20
    })).toThrow(Errors.ValidationError);
  });

  test("should throw if price is negative", () => {
    expect(() => new Location({
      title: "Valid",
      description: "Valid description",
      price: -10,
      size: 20
    })).toThrow(Errors.ValidationError);
  });

  // -----------------------------
  // SIZE TESTS
  // -----------------------------
  test("should throw if size is not a number", () => {
    expect(() => new Location({
      title: "Valid",
      description: "Valid description",
      price: 100,
      size: "big"
    })).toThrow(Errors.ValidationError);
  });

  test("should throw if size is negative", () => {
    expect(() => new Location({
      title: "Valid",
      description: "Valid description",
      price: 100,
      size: -5
    })).toThrow(Errors.ValidationError);
  });

  // -----------------------------
  // PICTURES TESTS
  // -----------------------------
  test("should throw if pictures is not an array", () => {
    expect(() => new Location({
      title: "Valid",
      description: "Valid description",
      price: 100,
      size: 20,
      pictures: "not-an-array"
    })).toThrow(Errors.ValidationError);
  });

  test("should accept an empty array for pictures", () => {
    const loc = new Location({
      title: "Valid",
      description: "Valid description",
      price: 100,
      size: 20,
      pictures: []
    });

    expect(loc.pictures).toEqual([]);
  });

});
