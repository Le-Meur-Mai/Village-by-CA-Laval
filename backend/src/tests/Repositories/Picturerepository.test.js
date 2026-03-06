import { jest } from "@jest/globals";
import PictureRepository from "../../repositories/PictureRepository.js";

describe("PictureRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      picture: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new PictureRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createPicture
  // ---------------------------------------------------------
  test("createPicture should call prisma.picture.create with correct params", async () => {
    const data = { url: "image.jpg", alt: "A picture" };
    const fakePicture = { id: 1, ...data };

    prismaMock.picture.create.mockResolvedValue(fakePicture);

    const result = await repo.createPicture(data);

    expect(prismaMock.picture.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(fakePicture);
  });

  test("createPicture should throw if prisma throws", async () => {
    prismaMock.picture.create.mockRejectedValue(new Error("DB error"));

    await expect(repo.createPicture({ url: "image.jpg" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getPictureById
  // ---------------------------------------------------------
  test("getPictureById should call prisma.picture.findUnique with correct params", async () => {
    const fakePicture = { id: "1" };
    prismaMock.picture.findUnique.mockResolvedValue(fakePicture);

    const result = await repo.getPictureById("1");

    expect(prismaMock.picture.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        location: true
      }
    });

    expect(result).toEqual(fakePicture);
  });

  test("getPictureById should throw if prisma throws", async () => {
    prismaMock.picture.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getPictureById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllPictures
  // ---------------------------------------------------------
  test("getAllPictures should call prisma.picture.findMany", async () => {
    const fakePictures = [{ id: 1 }, { id: 2 }];
    prismaMock.picture.findMany.mockResolvedValue(fakePictures);

    const result = await repo.getAllPictures();

    expect(prismaMock.picture.findMany).toHaveBeenCalledWith({
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        location: true
      }
    });

    expect(result).toEqual(fakePictures);
  });

  test("getAllPictures should throw if prisma throws", async () => {
    prismaMock.picture.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllPictures())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updatePicture
  // ---------------------------------------------------------
  test("updatePicture should call prisma.picture.update with correct params", async () => {
    const data = { url: "updated.jpg", alt: "Updated" };
    const fakePicture = { id: "1", ...data };

    prismaMock.picture.update.mockResolvedValue(fakePicture);

    const result = await repo.updatePicture("1", data);

    expect(prismaMock.picture.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data,
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        location: true
      }
    });

    expect(result).toEqual(fakePicture);
  });

  test("updatePicture should throw if prisma throws", async () => {
    prismaMock.picture.update.mockRejectedValue(new Error("DB error"));

    await expect(repo.updatePicture("1", { url: "updated.jpg" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deletePicture
  // ---------------------------------------------------------
  test("deletePicture should call prisma.picture.delete with correct params", async () => {
    const fakePicture = { id: "1" };
    prismaMock.picture.delete.mockResolvedValue(fakePicture);

    const result = await repo.deletePicture("1");

    expect(prismaMock.picture.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        logoPartner: true,
        post: true,
        descriptionPicture: true,
        logoStartUp: true,
        location: true
      }
    });

    expect(result).toEqual(fakePicture);
  });

  test("deletePicture should throw if prisma throws", async () => {
    prismaMock.picture.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deletePicture("1"))
      .rejects
      .toThrow("DB error");
  });

});
