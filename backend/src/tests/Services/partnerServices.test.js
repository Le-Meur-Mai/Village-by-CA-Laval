// src/tests/services/partnerServices.test.js
import { jest } from "@jest/globals";

// -----------------------------
// Mocks avant import
// -----------------------------
const partnerRepoMock = {
  createPartner: jest.fn(),
  getPartnerById: jest.fn(),
  getAllPartners: jest.fn(),
  getPartnerByName: jest.fn(),
  updatePartner: jest.fn(),
  deletePartner: jest.fn()
};

const pictureRepoMock = {
  createPicture: jest.fn(),
  deletePicture: jest.fn()
};

const PartnerMock = jest.fn();
const uploadPictureMock = jest.fn();

const cloudinaryMock = {
  uploader: {
    destroy: jest.fn()
  }
};

// Mock des modules avant import du service
await jest.unstable_mockModule("../../repositories/PartnerRepository.js", () => ({
  default: jest.fn(() => partnerRepoMock)
}));

await jest.unstable_mockModule("../../repositories/PictureRepository.js", () => ({
  default: jest.fn(() => pictureRepoMock)
}));

await jest.unstable_mockModule("../../classes/Partner.js", () => ({
  default: PartnerMock
}));

await jest.unstable_mockModule("../../utils/uploadToCloudinary.js", () => ({
  default: uploadPictureMock
}));

await jest.unstable_mockModule("../../../config/cloudinary.js", () => ({
  default: cloudinaryMock
}));

// Prisma
import prisma from "../../prismaClient.js";

// Service après mocks
const { default: PartnerServices } = await import("../../services/partnerServices.js");
const Errors = await import("../../errors/errorsClasses.js");

// -----------------------------
// Tests
// -----------------------------
describe("PartnerServices", () => {
  let partnerService;

  beforeEach(() => {
    // Reset des mocks
    Object.values(partnerRepoMock).forEach(fn => fn.mockReset());
    Object.values(pictureRepoMock).forEach(fn => fn.mockReset());
    PartnerMock.mockReset();
    uploadPictureMock.mockReset();
    cloudinaryMock.uploader.destroy.mockReset();

    prisma.$transaction = jest.fn(async (callback) => callback({}));

    partnerService = new PartnerServices();

    // comportement par défaut pour éviter les erreurs
    partnerRepoMock.getPartnerByName.mockResolvedValue(null);
  });

  // -----------------------------
  // CREATE
  // -----------------------------
  test("createPartner with logo", async () => {
    const data = { name: "Partner1", logo: "file1" };
    uploadPictureMock.mockResolvedValue({ secure_url: "url1", public_id: "id1" });
    pictureRepoMock.createPicture.mockResolvedValue({ id: 101 });
    partnerRepoMock.createPartner.mockResolvedValue({ id: 1, name: "Partner1", logoId: 101 });

    const result = await partnerService.createPartner({ ...data });

    expect(uploadPictureMock).toHaveBeenCalledWith("file1", "Partners");
    expect(pictureRepoMock.createPicture).toHaveBeenCalledWith({ secureUrl: "url1", publicId: "id1" }, {});
    expect(partnerRepoMock.createPartner).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: "Partner1", logoId: 101 });
  });

  test("createPartner without logo", async () => {
    const data = { name: "Partner2" };
    partnerRepoMock.createPartner.mockResolvedValue({ id: 2, name: "Partner2", logoId: "Id par defaut" });

    const result = await partnerService.createPartner({ ...data });

    expect(uploadPictureMock).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 2, name: "Partner2", logoId: "Id par defaut" });
  });

  test("createPartner cleanup Cloudinary on error", async () => {
    const data = { name: "Fail Partner", logo: "file2" };
    uploadPictureMock.mockResolvedValue({ secure_url: "url2", public_id: "id2" });
    pictureRepoMock.createPicture.mockRejectedValue(new Error("DB error"));

    await expect(partnerService.createPartner({ ...data })).rejects.toThrow("DB error");
    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("id2");
  });

  // -----------------------------
  // GET BY ID
  // -----------------------------
  test("getPartnerById returns partner", async () => {
    partnerRepoMock.getPartnerById.mockResolvedValue({ id: 1, name: "Partner1" });

    const result = await partnerService.getPartnerById(1);

    expect(partnerRepoMock.getPartnerById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, name: "Partner1" });
  });

  test("getPartnerById throws NotFoundError if not exists", async () => {
    partnerRepoMock.getPartnerById.mockResolvedValue(null);

    await expect(partnerService.getPartnerById(999)).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // GET ALL
  // -----------------------------
  test("getAllPartners returns partners", async () => {
    partnerRepoMock.getAllPartners.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await partnerService.getAllPartners();

    expect(partnerRepoMock.getAllPartners).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  // -----------------------------
  // UPDATE
  // -----------------------------
  test("updatePartner with new logo", async () => {
    const data = { name: "Updated Partner", logo: "newfile" };
    const existingPartner = { id: 1, name: "Old Partner", logoId: 201, logo: { publicId: "oldId" } };

    partnerRepoMock.getPartnerById.mockResolvedValue(existingPartner);
    uploadPictureMock.mockResolvedValue({ secure_url: "urlNew", public_id: "newId" });
    pictureRepoMock.createPicture.mockResolvedValue({ id: 202 });
    partnerRepoMock.updatePartner.mockResolvedValue({ id: 1, name: "Updated Partner", logoId: 202 });

    const result = await partnerService.updatePartner(1, data);

    expect(uploadPictureMock).toHaveBeenCalledWith("newfile", "Partners");
    expect(pictureRepoMock.createPicture).toHaveBeenCalledWith({ secureUrl: "urlNew", publicId: "newId" }, {});
    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("oldId");
    expect(pictureRepoMock.deletePicture).toHaveBeenCalledWith(201, {});
    expect(partnerRepoMock.updatePartner).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: "Updated Partner", logoId: 202 });
  });

  test("updatePartner without logo", async () => {
    const data = { name: "Updated Partner" };
    const existingPartner = { id: 1, name: "Old Partner", logoId: 201 };

    partnerRepoMock.getPartnerById.mockResolvedValue(existingPartner);
    partnerRepoMock.updatePartner.mockResolvedValue({ id: 1, name: "Updated Partner", logoId: 201 });

    const result = await partnerService.updatePartner(1, data);

    expect(uploadPictureMock).not.toHaveBeenCalled();
    expect(partnerRepoMock.updatePartner).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: "Updated Partner", logoId: 201 });
  });

  test("updatePartner throws NotFoundError if partner does not exist", async () => {
    partnerRepoMock.getPartnerById.mockResolvedValue(null);

    await expect(partnerService.updatePartner(999, { name: "x" })).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // DELETE
  // -----------------------------
  test("deletePartner removes logo and partner", async () => {
    const existingPartner = { id: 1, logoId: 301, logo: { publicId: "picId" } };
    partnerRepoMock.getPartnerById.mockResolvedValue(existingPartner);
    partnerRepoMock.deletePartner.mockResolvedValue(existingPartner);

    const result = await partnerService.deletePartner(1);

    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("picId");
    expect(pictureRepoMock.deletePicture).toHaveBeenCalledWith(301, {});
    expect(partnerRepoMock.deletePartner).toHaveBeenCalledWith(1, {});
    expect(result).toEqual(existingPartner);
  });

  test("deletePartner throws NotFoundError if partner does not exist", async () => {
    partnerRepoMock.getPartnerById.mockResolvedValue(null);

    await expect(partnerService.deletePartner(999)).rejects.toThrow(Errors.NotFoundError);
  });
});
