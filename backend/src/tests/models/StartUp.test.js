import StartUp from "../../classes/StartUp.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("StartUp Model", () => {

  const validData = {
    name: "TechNova",
    description: "A startup focused on innovative AI solutions.",
    isAlumni: true,
    website: "https://technova.com",

    userId: "12345678-1234-1234-1234-123456789012",
    descriptionPictureId: "12345678-1234-1234-1234-123456789012",
    logoId: "12345678-1234-1234-1234-123456789012",

    user: { id: 1, name: "Admin" },
    descriptionPicture: "desc.png",
    logo: "logo.png",
    types: [{ id: 1, name: "AI" }]
  };

  // ---------------------------------------------------------
  // 1. Création valide
  // ---------------------------------------------------------
  test("should create a valid StartUp instance", () => {
    const startup = new StartUp(validData);

    expect(startup.name).toBe(validData.name);
    expect(startup.description).toBe(validData.description);
    expect(startup.isAlumni).toBe(validData.isAlumni);
    expect(startup.website).toBe(validData.website);

    expect(startup.userId).toBe(validData.userId);
    expect(startup.descriptionPictureId).toBe(validData.descriptionPictureId);
    expect(startup.logoId).toBe(validData.logoId);

    expect(startup.user).toEqual(validData.user);
    expect(startup.descriptionPicture).toBe(validData.descriptionPicture);
    expect(startup.logo).toBe(validData.logo);
    expect(startup.types).toEqual(validData.types);
  });

  // ---------------------------------------------------------
  // 2. Tests name
  // ---------------------------------------------------------
  test("should throw if name is not a string", () => {
    expect(() => new StartUp({...validData, name: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too short", () => {
    expect(() => new StartUp({...validData, name: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too long", () => {
    const longName = "a".repeat(101);
    expect(() => new StartUp({...validData, name: longName}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 3. Tests description
  // ---------------------------------------------------------
  test("should throw if description is not a string", () => {
    expect(() => new StartUp({...validData, description: false}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too long", () => {
    const longDesc = "a".repeat(301);
    expect(() => new StartUp({...validData, description: longDesc}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept an empty description", () => {
    const startup = new StartUp({...validData, description: ""});
    expect(startup.description).toBe("");
  });

  // ---------------------------------------------------------
  // 4. Tests website
  // ---------------------------------------------------------
  test("should throw if website is not a string", () => {
    expect(() => new StartUp({...validData, website: 42}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if website is too long", () => {
    const longWebsite = "a".repeat(201);
    expect(() => new StartUp({...validData, website: longWebsite}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept an empty website", () => {
    const startup = new StartUp({...validData, website: ""});
    expect(startup.website).toBe("");
  });

  // ---------------------------------------------------------
  // 5. Tests isAlumni
  // ---------------------------------------------------------
  test("should throw if isAlumni is not a boolean", () => {
    expect(() => new StartUp({...validData, isAlumni: "yes"}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 6. Tests UUID-like IDs (userId, descriptionPictureId, logoId)
  // ---------------------------------------------------------
  const invalidIds = ["short", 123, {}, [], null];

  ["userId", "descriptionPictureId", "logoId"].forEach(field => {
    test(`should throw if ${field} is not a string`, () => {
      expect(() => new StartUp({...validData, [field]: 123}))
        .toThrow(Errors.ValidationError);
    });

    test(`should throw if ${field} does not have length 36`, () => {
      expect(() => new StartUp({...validData, [field]: "invalid"}))
        .toThrow(Errors.ValidationError);
    });

    test(`should accept a valid UUID-like ${field}`, () => {
      const startup = new StartUp(validData);
      expect(startup[field]).toBe(validData[field]);
    });
  });

  // ---------------------------------------------------------
  // 7. Tests types
  // ---------------------------------------------------------
  test("should throw if types is not an array", () => {
    expect(() => new StartUp({...validData, types: "not-array"}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept an empty array for types", () => {
    const startup = new StartUp({...validData, types: []});
    expect(startup.types).toEqual([]);
  });

  test("should accept an array of objects for types", () => {
    const startup = new StartUp({...validData, types: [{ id: 1 }]});
    expect(startup.types).toEqual([{ id: 1 }]);
  });

});
