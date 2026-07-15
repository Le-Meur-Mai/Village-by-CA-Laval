import TypeServices from "../../services/typeServices.js";
import * as Errors from "../../errors/errorsClasses.js";
import { jest } from "@jest/globals";

describe("TypeServices - full test suite", () => {

  let typeService;

  const TYPE_ID = "11111111-1111-1111-1111-111111111111";
  const STARTUP_ID = "22222222-2222-2222-2222-222222222222";

  beforeEach(() => {

    typeService = new TypeServices();

    
    typeService.typeRepo = {
      createType: jest.fn(),
      getTypeById: jest.fn(),
      getTypeByName: jest.fn(),
      getAllTypes: jest.fn(),
      updateType: jest.fn(),
      deleteType: jest.fn()
    };
    
    typeService.startUpRepo = {
      getStartUpById: jest.fn()
    };
    
    typeService.typeRepo.getTypeByName.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /*
  CREATE TYPE
  */

  test("createType should create type without startups", async () => {

    const data = {
      name: "FinTech",
      color: "#FFAA00"
    };

    typeService.typeRepo.createType.mockResolvedValue({
      id: TYPE_ID,
      ...data
    });

    const result = await typeService.createType(data);

    expect(typeService.typeRepo.createType).toHaveBeenCalledWith(data);
    expect(result.name).toBe("FinTech");

  });

  test("createType should create type with startups", async () => {

    const data = {
      name: "HealthTech",
      color: "#00FFAA",
      startUps: [STARTUP_ID]
    };

    typeService.startUpRepo.getStartUpById.mockResolvedValue({
      id: STARTUP_ID
    });

    typeService.typeRepo.createType.mockResolvedValue({
      id: TYPE_ID,
      ...data
    });

    const result = await typeService.createType(data);

    expect(typeService.startUpRepo.getStartUpById).toHaveBeenCalledWith(STARTUP_ID);
    expect(typeService.typeRepo.createType).toHaveBeenCalled();
    expect(result.name).toBe("HealthTech");

  });

  test("createType should throw if startup does not exist", async () => {

    const data = {
      name: "AI",
      color: "#000000",
      startUps: [STARTUP_ID]
    };

    typeService.startUpRepo.getStartUpById.mockResolvedValue(null);

    await expect(typeService.createType(data))
      .rejects
      .toThrow(Errors.NotFoundError);

  });

  /*
  GET TYPE
  */

  test("getTypeById should return type", async () => {

    const type = {
      id: TYPE_ID,
      name: "FinTech",
      color: "#FFAA00"
    };

    typeService.typeRepo.getTypeById.mockResolvedValue(type);

    const result = await typeService.getTypeById(TYPE_ID);

    expect(result).toEqual(type);

  });

  test("getTypeById should throw if type does not exist", async () => {

    typeService.typeRepo.getTypeById.mockResolvedValue(null);

    await expect(typeService.getTypeById(TYPE_ID))
      .rejects
      .toThrow(Errors.NotFoundError);

  });

  /*
  GET ALL TYPES
  */

  test("getAllTypes should return all types", async () => {

    const types = [
      { id: TYPE_ID, name: "FinTech", color: "#FFAA00" },
      { id: "33333333-3333-3333-3333-333333333333", name: "AI", color: "#000000" }
    ];

    typeService.typeRepo.getAllTypes.mockResolvedValue(types);

    const result = await typeService.getAllTypes();

    expect(result.length).toBe(2);
    expect(typeService.typeRepo.getAllTypes).toHaveBeenCalled();

  });

  /*
  UPDATE TYPE
  */

  test("updateType should update type", async () => {

    const existingType = {
      id: TYPE_ID,
      name: "FinTech",
      color: "#FFAA00"
    };

    const data = {
      name: "Updated FinTech"
    };

    typeService.typeRepo.getTypeById.mockResolvedValue(existingType);

    typeService.typeRepo.updateType.mockResolvedValue({
      ...existingType,
      ...data
    });

    const result = await typeService.updateType(TYPE_ID, data);

    expect(typeService.typeRepo.updateType).toHaveBeenCalledWith(TYPE_ID, data);
    expect(result.name).toBe("Updated FinTech");

  });

  test("updateType should throw if type does not exist", async () => {

    typeService.typeRepo.getTypeById.mockResolvedValue(null);

    await expect(typeService.updateType(TYPE_ID, { name: "test" }))
      .rejects
      .toThrow(Errors.NotFoundError);

  });

  test("updateType should throw if startup does not exist", async () => {

    const existingType = {
      id: TYPE_ID,
      name: "FinTech",
      color: "#FFAA00"
    };

    const data = {
      startUps: [STARTUP_ID]
    };

    typeService.typeRepo.getTypeById.mockResolvedValue(existingType);
    typeService.startUpRepo.getStartUpById.mockResolvedValue(null);

    await expect(typeService.updateType(TYPE_ID, data))
      .rejects
      .toThrow(Errors.NotFoundError);

  });

  /*
  DELETE TYPE
  */

  test("deleteType should delete type", async () => {

    const existingType = {
      id: TYPE_ID,
      name: "FinTech",
      color: "#FFAA00"
    };

    typeService.typeRepo.getTypeById.mockResolvedValue(existingType);
    typeService.typeRepo.deleteType.mockResolvedValue(existingType);

    const result = await typeService.deleteType(TYPE_ID);

    expect(typeService.typeRepo.deleteType).toHaveBeenCalledWith(TYPE_ID);
    expect(result).toEqual(existingType);

  });

  test("deleteType should throw if type does not exist", async () => {

    typeService.typeRepo.getTypeById.mockResolvedValue(null);

    await expect(typeService.deleteType(TYPE_ID))
      .rejects
      .toThrow(Errors.NotFoundError);

  });

});
