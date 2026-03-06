import Quote from "../../classes/Quote.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("Quote Model", () => {

  const validData = {
    firstName: "Alice",
    lastName: "Dupont",
    description: "A meaningful testimonial about the service.",
    userId: "12345678-1234-1234-1234-123456789012",
    user: { id: 1, name: "Test User" }
  };

  // ---------------------------------------------------------
  // 1. Création valide
  // ---------------------------------------------------------
  test("should create a valid Quote instance", () => {
    const quote = new Quote(validData);

    expect(quote.firstName).toBe(validData.firstName);
    expect(quote.lastName).toBe(validData.lastName);
    expect(quote.description).toBe(validData.description);
    expect(quote.userId).toBe(validData.userId);
    expect(quote.user).toEqual(validData.user);
  });

  // ---------------------------------------------------------
  // 2. Tests firstName
  // ---------------------------------------------------------
  test("should throw if firstName is not a string", () => {
    expect(() => new Quote({...validData, firstName: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if firstName is too short", () => {
    expect(() => new Quote({...validData, firstName: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if firstName is too long", () => {
    const longName = "a".repeat(21);
    expect(() => new Quote({...validData, firstName: longName}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 3. Tests lastName
  // ---------------------------------------------------------
  test("should throw if lastName is not a string", () => {
    expect(() => new Quote({...validData, lastName: false}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if lastName is too short", () => {
    expect(() => new Quote({...validData, lastName: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if lastName is too long", () => {
    const longName = "a".repeat(21);
    expect(() => new Quote({...validData, lastName: longName}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 4. Tests description
  // ---------------------------------------------------------
  test("should throw if description is not a string", () => {
    expect(() => new Quote({...validData, description: 42}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too short", () => {
    expect(() => new Quote({...validData, description: "short"}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too long", () => {
    const longDesc = "a".repeat(201);
    expect(() => new Quote({...validData, description: longDesc}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 5. Tests userId
  // ---------------------------------------------------------
  test("should throw if userId is not a string", () => {
    expect(() => new Quote({...validData, userId: 999}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if userId does not have length 36", () => {
    expect(() => new Quote({...validData, userId: "short-id"}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept a valid UUID-like userId", () => {
    const quote = new Quote(validData);
    expect(quote.userId).toBe(validData.userId);
  });

});
