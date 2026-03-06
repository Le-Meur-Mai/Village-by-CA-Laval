import { jest } from "@jest/globals";
import LocationRepository from "../../repositories/LocationRepository.js";

describe("LocationRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      location: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new LocationRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createLocation
  // ---------------------------------------------------------
  test("createLocation should call prisma.location.create with correct params", async () => {
    const data = {
      title: "Nice apartment",
      description: "A beautiful place",
      price: 100,
      size: 45,
      pictures: ["p1", "p2"]
    };

    const fakeLocation = { id: 1, ...data };
    prismaMock.location.create.mockResolvedValue(fakeLocation);

    const result = await repo.createLocation(data);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        title: "Nice apartment",
        description: "A beautiful place",
        price: 100,
        size: 45,
        pictures: {
          connect: [{ id: "p1" }, { id: "p2" }]
        }
      },
      include: { pictures: true }
    });

    expect(result).toEqual(fakeLocation);
  });

  test("createLocation should throw if prisma throws", async () => {
    prismaMock.location.create.mockRejectedValue(new Error("DB error"));

    await expect(
      repo.createLocation({
        title: "Nice apartment",
        pictures: ["p1"]
      })
    ).rejects.toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getLocationById
  // ---------------------------------------------------------
  test("getLocationById should call prisma.location.findUnique with correct params", async () => {
    const fakeLocation = { id: "1" };
    prismaMock.location.findUnique.mockResolvedValue(fakeLocation);

    const result = await repo.getLocationById("1");

    expect(prismaMock.location.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { pictures: true }
    });

    expect(result).toEqual(fakeLocation);
  });

  test("getLocationById should throw if prisma throws", async () => {
    prismaMock.location.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getLocationById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllLocations
  // ---------------------------------------------------------
  test("getAllLocations should call prisma.location.findMany", async () => {
    const fakeLocations = [{ id: 1 }, { id: 2 }];
    prismaMock.location.findMany.mockResolvedValue(fakeLocations);

    const result = await repo.getAllLocations();

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      include: { pictures: true }
    });

    expect(result).toEqual(fakeLocations);
  });

  test("getAllLocations should throw if prisma throws", async () => {
    prismaMock.location.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllLocations())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updateLocation
  // ---------------------------------------------------------
  test("updateLocation should call prisma.location.update with correct params", async () => {
    const data = {
      title: "Updated",
      price: 200,
      pictures: ["p3", "p4"]
    };

    const fakeLocation = { id: "1", ...data };
    prismaMock.location.update.mockResolvedValue(fakeLocation);

    const result = await repo.updateLocation("1", data);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        title: "Updated",
        price: 200,
        pictures: {
          set: [{ id: "p3" }, { id: "p4" }]
        }
      },
      include: { pictures: true }
    });

    expect(result).toEqual(fakeLocation);
  });

  test("updateLocation should throw if prisma throws", async () => {
    prismaMock.location.update.mockRejectedValue(new Error("DB error"));

    await expect(
      repo.updateLocation("1", { title: "Updated", pictures: [] })
    ).rejects.toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deleteLocation
  // ---------------------------------------------------------
  test("deleteLocation should call prisma.location.delete with correct params", async () => {
    const fakeLocation = { id: "1" };
    prismaMock.location.delete.mockResolvedValue(fakeLocation);

    const result = await repo.deleteLocation("1");

    expect(prismaMock.location.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { pictures: true }
    });

    expect(result).toEqual(fakeLocation);
  });

  test("deleteLocation should throw if prisma throws", async () => {
    prismaMock.location.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deleteLocation("1"))
      .rejects
      .toThrow("DB error");
  });

});
