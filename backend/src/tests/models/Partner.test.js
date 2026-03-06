import Partner from "../../classes/Partner.js";
import * as Errors from "../../errors/errorsClasses.js";

describe("Partner Model", () => {

  const validData = {
    name: "OpenAI",
    description: "A partner providing advanced AI technologies.",
    website: "https://openai.com",
    financialAid: true,
    logoId: "12345678-1234-1234-1234-123456789012",
    logo: "logo.png"
  };

  // ---------------------------------------------------------
  // 1. Création valide
  // ---------------------------------------------------------
  test("should create a valid Partner instance", () => {
    const partner = new Partner(validData);

    expect(partner.name).toBe(validData.name);
    expect(partner.description).toBe(validData.description);
    expect(partner.website).toBe(validData.website);
    expect(partner.financialAid).toBe(validData.financialAid);
    expect(partner.logoId).toBe(validData.logoId);
    expect(partner.logo).toBe(validData.logo);
  });

  // ---------------------------------------------------------
  // 2. Tests name
  // ---------------------------------------------------------
  test("should throw if name is not a string", () => {
    expect(() => new Partner({...validData, name: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too short", () => {
    expect(() => new Partner({...validData, name: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if name is too long", () => {
    const longName = "a".repeat(101);
    expect(() => new Partner({...validData, name: longName}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 3. Tests description
  // ---------------------------------------------------------
  test("should throw if description is not a string", () => {
    expect(() => new Partner({...validData, description: 42}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too short", () => {
    expect(() => new Partner({...validData, description: "short"}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if description is too long", () => {
    const longDesc = "a".repeat(201);
    expect(() => new Partner({...validData, description: longDesc}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 4. Tests website
  // ---------------------------------------------------------
  test("should throw if website is not a string", () => {
    expect(() => new Partner({...validData, website: false}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if website is too short", () => {
    expect(() => new Partner({...validData, website: ""}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if website is too long", () => {
    const longWebsite = "a".repeat(201);
    expect(() => new Partner({...validData, website: longWebsite}))
      .toThrow(Errors.ValidationError);
  });

  // ---------------------------------------------------------
  // 5. Tests logoId
  // ---------------------------------------------------------
  test("should throw if logoId is not a string", () => {
    expect(() => new Partner({...validData, logoId: 123}))
      .toThrow(Errors.ValidationError);
  });

  test("should throw if logoId does not have length 36", () => {
    expect(() => new Partner({...validData, logoId: "short-id"}))
      .toThrow(Errors.ValidationError);
  });

  test("should accept a valid UUID-like logoId", () => {
    const partner = new Partner(validData);
    expect(partner.logoId).toBe(validData.logoId);
  });

});
