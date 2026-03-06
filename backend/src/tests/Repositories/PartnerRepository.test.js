import { jest } from "@jest/globals";
import PartnerRepository from "../../repositories/PartnerRepository.js";

describe("PartnerRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      partner: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new PartnerRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createPartner
  // ---------------------------------------------------------
  test("createPartner should call prisma.partner.create with correct params", async () => {
    const data = {
      name: "OpenAI",
      description: "AI research lab",
      website: "https://openai.com",
      financialAid: true,
      logoId: "12345678-1234-1234-1234-123456789012"
    };

    const fakePartner = { id: 1, ...data };
    prismaMock.partner.create.mockResolvedValue(fakePartner);

    const result = await repo.createPartner(data);

    expect(prismaMock.partner.create).toHaveBeenCalledWith({
      data,
      include: { logo: true }
    });

    expect(result).toEqual(fakePartner);
  });

  test("createPartner should throw if prisma throws", async () => {
    prismaMock.partner.create.mockRejectedValue(new Error("DB error"));

    // on s'attend à ce que la le repo rejette une erreur.
    await expect(repo.createPartner({ name: "Test" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getPartnerById
  // ---------------------------------------------------------
  test("getPartnerById should call prisma.partner.findUnique with correct params", async () => {
    const fakePartner = { id: "1" };
    prismaMock.partner.findUnique.mockResolvedValue(fakePartner);

    const result = await repo.getPartnerById("1");

    expect(prismaMock.partner.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { logo: true }
    });

    expect(result).toEqual(fakePartner);
  });

  test("getPartnerById should throw if prisma throws", async () => {
    prismaMock.partner.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getPartnerById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllPartners
  // ---------------------------------------------------------
  test("getAllPartners should call prisma.partner.findMany", async () => {
    const fakePartners = [{ id: 1 }, { id: 2 }];
    prismaMock.partner.findMany.mockResolvedValue(fakePartners);

    const result = await repo.getAllPartners();

    expect(prismaMock.partner.findMany).toHaveBeenCalledWith({
      include: { logo: true }
    });

    expect(result).toEqual(fakePartners);
  });

  test("getAllPartners should throw if prisma throws", async () => {
    prismaMock.partner.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllPartners())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updatePartner
  // ---------------------------------------------------------
  test("updatePartner should call prisma.partner.update with correct params", async () => {
    const data = {
      name: "Updated Partner",
      website: "https://updated.com"
    };

    const fakePartner = { id: "1", ...data };
    prismaMock.partner.update.mockResolvedValue(fakePartner);

    const result = await repo.updatePartner("1", data);

    expect(prismaMock.partner.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data,
      include: { logo: true }
    });

    expect(result).toEqual(fakePartner);
  });

  test("updatePartner should throw if prisma throws", async () => {
    prismaMock.partner.update.mockRejectedValue(new Error("DB error"));

    await expect(repo.updatePartner("1", { name: "Updated" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deletePartner
  // ---------------------------------------------------------
  test("deletePartner should call prisma.partner.delete with correct params", async () => {
    const fakePartner = { id: "1" };
    prismaMock.partner.delete.mockResolvedValue(fakePartner);

    const result = await repo.deletePartner("1");

    expect(prismaMock.partner.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { logo: true }
    });

    expect(result).toEqual(fakePartner);
  });

  test("deletePartner should throw if prisma throws", async () => {
    prismaMock.partner.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deletePartner("1"))
      .rejects
      .toThrow("DB error");
  });

});