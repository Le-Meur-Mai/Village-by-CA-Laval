import { jest } from "@jest/globals";
import StartUpRepository from "../../repositories/StartUpRepository.js";

describe("StartUpRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      startUp: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new StartUpRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createStartUp
  // ---------------------------------------------------------
  test("createStartUp should call prisma.startUp.create with correct params", async () => {
    const data = {
      name: "My Startup",
      description: "Cool project",
      types: ["t1", "t2"]
    };

    const fakeStartUp = { id: 1, ...data };
    prismaMock.startUp.create.mockResolvedValue(fakeStartUp);

    const result = await repo.createStartUp(data);

    expect(prismaMock.startUp.create).toHaveBeenCalledWith({
      data: {
        name: "My Startup",
        description: "Cool project",
        types: {
          connect: [{ id: "t1" }, { id: "t2" }]
        }
      },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUp);
  });

  test("createStartUp should handle undefined types", async () => {
    const data = {
      name: "No Types Startup",
      description: "Simple"
    };

    const fakeStartUp = { id: 1, ...data };
    prismaMock.startUp.create.mockResolvedValue(fakeStartUp);

    const result = await repo.createStartUp(data);

    expect(prismaMock.startUp.create).toHaveBeenCalledWith({
      data: {
        name: "No Types Startup",
        description: "Simple",
        types: undefined
      },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUp);
  });

  test("createStartUp should throw if prisma throws", async () => {
    prismaMock.startUp.create.mockRejectedValue(new Error("DB error"));

    await expect(
      repo.createStartUp({ name: "Fail Startup" })
    ).rejects.toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getStartUpById
  // ---------------------------------------------------------
  test("getStartUpById should call prisma.startUp.findUnique with correct params", async () => {
    const fakeStartUp = { id: "1" };
    prismaMock.startUp.findUnique.mockResolvedValue(fakeStartUp);

    const result = await repo.getStartUpById("1");

    expect(prismaMock.startUp.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUp);
  });

  test("getStartUpById should throw if prisma throws", async () => {
    prismaMock.startUp.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getStartUpById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllStartUps
  // ---------------------------------------------------------
  test("getAllStartUps should call prisma.startUp.findMany", async () => {
    const fakeStartUps = [{ id: 1 }, { id: 2 }];
    prismaMock.startUp.findMany.mockResolvedValue(fakeStartUps);

    const result = await repo.getAllStartUps();

    expect(prismaMock.startUp.findMany).toHaveBeenCalledWith({
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUps);
  });

  test("getAllStartUps should throw if prisma throws", async () => {
    prismaMock.startUp.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllStartUps())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updateStartUp
  // ---------------------------------------------------------
  test("updateStartUp should call prisma.startUp.update with correct params", async () => {
    const data = {
      name: "Updated Startup",
      types: ["t3", "t4"]
    };

    const fakeStartUp = { id: "1", ...data };
    prismaMock.startUp.update.mockResolvedValue(fakeStartUp);

    const result = await repo.updateStartUp("1", data);

    expect(prismaMock.startUp.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated Startup",
        types: {
          set: [{ id: "t3" }, { id: "t4" }]
        }
      },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUp);
  });

  test("updateStartUp should handle undefined types", async () => {
    const data = { name: "Updated No Types" };
    const fakeStartUp = { id: "1", ...data };

    prismaMock.startUp.update.mockResolvedValue(fakeStartUp);

    const result = await repo.updateStartUp("1", data);

    expect(prismaMock.startUp.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated No Types",
        types: undefined
      },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUp);
  });

  test("updateStartUp should throw if prisma throws", async () => {
    prismaMock.startUp.update.mockRejectedValue(new Error("DB error"));

    await expect(
      repo.updateStartUp("1", { name: "Updated" })
    ).rejects.toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deleteStartUp
  // ---------------------------------------------------------
  test("deleteStartUp should call prisma.startUp.delete with correct params", async () => {
    const fakeStartUp = { id: "1" };
    prismaMock.startUp.delete.mockResolvedValue(fakeStartUp);

    const result = await repo.deleteStartUp("1");

    expect(prismaMock.startUp.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        descriptionPicture: true,
        logo: true,
        user: true,
        types: true
      }
    });

    expect(result).toEqual(fakeStartUp);
  });

  test("deleteStartUp should throw if prisma throws", async () => {
    prismaMock.startUp.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deleteStartUp("1"))
      .rejects
      .toThrow("DB error");
  });

});
