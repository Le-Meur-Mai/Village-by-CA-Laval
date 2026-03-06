import { jest } from "@jest/globals";
import TypeRepository from "../../repositories/TypeRepository.js";

describe("TypeRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      type: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new TypeRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createType
  // ---------------------------------------------------------
  test("createType should call prisma.type.create with correct params", async () => {
    const data = {
      name: "Tech",
      startUps: ["s1", "s2"]
    };

    const fakeType = { id: 1, ...data };
    prismaMock.type.create.mockResolvedValue(fakeType);

    const result = await repo.createType(data);

    expect(prismaMock.type.create).toHaveBeenCalledWith({
      data: {
        name: "Tech",
        startUps: {
          connect: [{ id: "s1" }, { id: "s2" }]
        }
      },
      include: { startUps: true }
    });

    expect(result).toEqual(fakeType);
  });

  test("createType should handle undefined startUps", async () => {
    const data = { name: "No Startups" };
    const fakeType = { id: 1, ...data };

    prismaMock.type.create.mockResolvedValue(fakeType);

    const result = await repo.createType(data);

    expect(prismaMock.type.create).toHaveBeenCalledWith({
      data: {
        name: "No Startups",
        startUps: undefined
      },
      include: { startUps: true }
    });

    expect(result).toEqual(fakeType);
  });

  test("createType should throw if prisma throws", async () => {
    prismaMock.type.create.mockRejectedValue(new Error("DB error"));

    await expect(repo.createType({ name: "Fail" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllTypes
  // ---------------------------------------------------------
  test("getAllTypes should call prisma.type.findMany", async () => {
    const fakeTypes = [{ id: 1 }, { id: 2 }];
    prismaMock.type.findMany.mockResolvedValue(fakeTypes);

    const result = await repo.getAllTypes();

    expect(prismaMock.type.findMany).toHaveBeenCalledWith({
      include: { startUps: true }
    });

    expect(result).toEqual(fakeTypes);
  });

  test("getAllTypes should throw if prisma throws", async () => {
    prismaMock.type.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllTypes())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getTypeById
  // ---------------------------------------------------------
  test("getTypeById should call prisma.type.findUnique with correct params", async () => {
    const fakeType = { id: "1" };
    prismaMock.type.findUnique.mockResolvedValue(fakeType);

    const result = await repo.getTypeById("1");

    expect(prismaMock.type.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { startUps: true }
    });

    expect(result).toEqual(fakeType);
  });

  test("getTypeById should throw if prisma throws", async () => {
    prismaMock.type.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getTypeById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updateType
  // ---------------------------------------------------------
  test("updateType should call prisma.type.update with correct params", async () => {
    const data = {
      name: "Updated Type",
      startUps: ["s3", "s4"]
    };

    const fakeType = { id: "1", ...data };
    prismaMock.type.update.mockResolvedValue(fakeType);

    const result = await repo.updateType("1", data);

    expect(prismaMock.type.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated Type",
        startUps: {
          connect: [{ id: "s3" }, { id: "s4" }]
        }
      },
      include: { startUps: true }
    });

    expect(result).toEqual(fakeType);
  });

  test("updateType should handle undefined startUps", async () => {
    const data = { name: "Updated No Startups" };
    const fakeType = { id: "1", ...data };

    prismaMock.type.update.mockResolvedValue(fakeType);

    const result = await repo.updateType("1", data);

    expect(prismaMock.type.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated No Startups",
        startUps: undefined
      },
      include: { startUps: true }
    });

    expect(result).toEqual(fakeType);
  });

  test("updateType should throw if prisma throws", async () => {
    prismaMock.type.update.mockRejectedValue(new Error("DB error"));

    await expect(repo.updateType("1", { name: "Updated" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deleteType
  // ---------------------------------------------------------
  test("deleteType should call prisma.type.delete with correct params", async () => {
    const fakeType = { id: "1" };
    prismaMock.type.delete.mockResolvedValue(fakeType);

    const result = await repo.deleteType("1");

    expect(prismaMock.type.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { startUps: true }
    });

    expect(result).toEqual(fakeType);
  });

  test("deleteType should throw if prisma throws", async () => {
    prismaMock.type.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deleteType("1"))
      .rejects
      .toThrow("DB error");
  });

});
