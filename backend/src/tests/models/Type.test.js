import Type from "../../classes/Type.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("Type Model", () => {

  const validData = {
    name: "AI",
    color: "#FFAA33",
    startUps: [{ id: 1, name: "TechNova" }]
  };

  // ---------------------------------------------------------
  // 1. Création valide
  // ---------------------------------------------------------
  test("should create a valid Type instance", () => {
    const type = new Type(validData);

    expect(type.name).toBe(validData.name);
    expect(type.color).toBe(validData.color);
    expect(type.startUps).toEqual(validData.startUps);
  });

  // ---------------------------------------------------------
  // 2. Tests name
  // ---------------------------------------------------------
  test("should throw if name is not a string", () => {
    expect(() => new Type({...validData, name: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too short", () => {
    expect(() => new Type({...validData, name: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too long", () => {
    const longName = "a".repeat(31);
    expect(() => new Type({...validData, name: longName}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 3. Tests color
  // ---------------------------------------------------------
  test("should throw if color is not a string", () => {
    expect(() => new Type({...validData, color: false}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if color does not have exactly 7 characters", () => {
    expect(() => new Type({...validData, color: "FFF"}))
      .toThrow(Errors.ValidationError);

    expect(() => new Type({...validData, color: "12345678"}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept a valid 7-character color string", () => {
    const type = new Type(validData);
    expect(type.color).toBe(validData.color);
  });

  // ---------------------------------------------------------
  // 4. Tests startUps
  // ---------------------------------------------------------
  test("should throw if startUps is not an array", () => {
    expect(() => new Type({...validData, startUps: "not-array"}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept an empty array for startUps", () => {
    const type = new Type({...validData, startUps: []});
    expect(type.startUps).toEqual([]);
  });

  test("should accept an array of objects for startUps", () => {
    const type = new Type({...validData, startUps: [{ id: 1 }]});
    expect(type.startUps).toEqual([{ id: 1 }]);
  });

});
