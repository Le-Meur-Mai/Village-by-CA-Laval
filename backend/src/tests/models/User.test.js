import User from "../../classes/User.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("User Model", () => {

  const validData = {
    name: "Alice Dupont",
    email: "alice@example.com",
    password: "supersecurepassword",
    quotes: [{ id: 1, content: "Hello" }],
    startUp: { id: 1, name: "TechNova" }
  };

  // ---------------------------------------------------------
  // 1. Création valide
  // ---------------------------------------------------------
  test("should create a valid User instance", () => {
    const user = new User(validData);

    expect(user.name).toBe(validData.name);
    expect(user.email).toBe(validData.email);
    expect(user.password).toBe(validData.password);
    expect(user.quotes).toEqual(validData.quotes);
    expect(user.startUp).toEqual(validData.startUp);

    // isAdmin doit être false par défaut
    expect(user.isAdmin).toBe(false);
  });

  // ---------------------------------------------------------
  // 2. Tests name
  // ---------------------------------------------------------
  test("should throw if name is not a string", () => {
    expect(() => new User({...validData, name: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too short", () => {
    expect(() => new User({...validData, name: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too long", () => {
    const longName = "a".repeat(51);
    expect(() => new User({...validData, name: longName}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 3. Tests email
  // ---------------------------------------------------------
  test("should throw if email is not a string", () => {
    expect(() => new User({...validData, email: false}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if email has wrong format", () => {
    expect(() => new User({...validData, email: "not-an-email"}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if email is too long", () => {
    const longEmail = "a".repeat(101) + "@example.com";
    expect(() => new User({...validData, email: longEmail}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept a valid email", () => {
    const user = new User(validData);
    expect(user.email).toBe(validData.email);
  });

  // ---------------------------------------------------------
  // 4. Tests password
  // ---------------------------------------------------------
  test("should throw if password is not a string", () => {
    expect(() => new User({...validData, password: 12345}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if password is too short", () => {
    expect(() => new User({...validData, password: "short"}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if password is too long", () => {
    const longPassword = "a".repeat(256);
    expect(() => new User({...validData, password: longPassword}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept a valid password", () => {
    const user = new User(validData);
    expect(user.password).toBe(validData.password);
  });

  // ---------------------------------------------------------
  // 5. Tests quotes
  // ---------------------------------------------------------
  test("should accept an empty array for quotes", () => {
    const user = new User({...validData, quotes: []});
    expect(user.quotes).toEqual([]);
  });

  test("should accept an array of objects for quotes", () => {
    const user = new User({...validData, quotes: [{ id: 1 }]});
    expect(user.quotes).toEqual([{ id: 1 }]);
  });

  // ---------------------------------------------------------
  // 6. Tests startUp
  // ---------------------------------------------------------
  test("should accept null as startUp", () => {
    const user = new User({...validData, startUp: null});
    expect(user.startUp).toBeNull();
  });

  test("should accept any object as startUp", () => {
    const user = new User({...validData, startUp: { id: 99 }});
    expect(user.startUp).toEqual({ id: 99 });
  });

});
