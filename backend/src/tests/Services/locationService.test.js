// src/tests/services/locationServices.test.js
import { jest } from "@jest/globals";

// -----------------------------
// Mocks avant les imports
// -----------------------------

// Mocks des Repositories
const locationRepoMock = {
  createLocation: jest.fn(),
  getLocationById: jest.fn(),
  getAllLocations: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn()
};

const pictureRepoMock = {
  createPicture: jest.fn(),
  getPictureById: jest.fn(),
  deletePicture: jest.fn()
};

// Mock de la classe Location (validation des données)
const LocationMock = jest.fn();

// Mock de la fonction d’upload Cloudinary
const uploadPictureMock = jest.fn();

// Mock de Cloudinary
const cloudinaryMock = {
  uploader: {
    destroy: jest.fn()
  }
};

// Mock des modules avant import
await jest.unstable_mockModule("../../repositories/LocationRepository.js", () => ({
  default: jest.fn(() => locationRepoMock)
}));

await jest.unstable_mockModule("../../repositories/PictureRepository.js", () => ({
  default: jest.fn(() => pictureRepoMock)
}));

await jest.unstable_mockModule("../../classes/Location.js", () => ({
  default: LocationMock
}));

await jest.unstable_mockModule("../../utils/uploadToCloudinary.js", () => ({
  default: uploadPictureMock
}));

await jest.unstable_mockModule("../../../config/cloudinary.js", () => ({
  default: cloudinaryMock
}));

// Prisma peut être importé directement et mocké plus tard
import prisma from "../../prismaClient.js";

// Import du service après les mocks
const { default: LocationServices } = await import("../../services/locationServices.js");
const Errors = await import("../../errors/errorsClasses.js");

// -----------------------------
// Tests
// -----------------------------
describe("LocationServices", () => {
  let locationService;

  beforeEach(() => {
    // Reset des mocks
    Object.values(locationRepoMock).forEach(fn => fn.mockReset());
    Object.values(pictureRepoMock).forEach(fn => fn.mockReset());
    LocationMock.mockReset();
    uploadPictureMock.mockReset();
    cloudinaryMock.uploader.destroy.mockReset();

    // Mock Prisma transaction
    prisma.$transaction = jest.fn(async (callback) => callback({}));

    // Nouvelle instance du service
    locationService = new LocationServices();
  });

  test("should create a location successfully", async () => {
    const data = {
      name: "Test Location",
      pictures: ["pic1", "pic2"]
    };

    // Mock de l’upload Cloudinary pour chaque image
    uploadPictureMock.mockResolvedValueOnce({ secure_url: "url1", public_id: "id1" });
    uploadPictureMock.mockResolvedValueOnce({ secure_url: "url2", public_id: "id2" });

    // Mock création de pictures en DB
    pictureRepoMock.createPicture.mockResolvedValueOnce({ id: 101 });
    pictureRepoMock.createPicture.mockResolvedValueOnce({ id: 102 });

    // Mock création de location
    locationRepoMock.createLocation.mockResolvedValue({
      id: 1,
      name: data.name,
      pictures: [101, 102] // ici on met les IDs qui seront effectivement dans la DB
    });

    const result = await locationService.createLocation({ ...data }); 
    // On clone data pour éviter de passer l’objet original qui sera muté

    // Vérifications
    expect(uploadPictureMock).toHaveBeenCalledTimes(2);
    expect(pictureRepoMock.createPicture).toHaveBeenCalledTimes(2);
    expect(locationRepoMock.createLocation).toHaveBeenCalled();

    // Résultat attendu explicite
    const expectedResult = {
      id: 1,
      name: "Test Location",
      pictures: [101, 102]
    };
    expect(result).toEqual(expectedResult);
  });

  test("should throw ValidationError if pictures are invalid", async () => {
    const data = { name: "Invalid Location", pictures: [] };

    await expect(locationService.createLocation(data))
      .rejects
      .toThrow(Errors.ValidationError);

    expect(uploadPictureMock).not.toHaveBeenCalled();
    expect(pictureRepoMock.createPicture).not.toHaveBeenCalled();
  });

  test("should cleanup Cloudinary uploads on error", async () => {
    const data = { name: "Test Location", pictures: ["pic1"] };

    // L’upload fonctionne mais la DB échoue
    uploadPictureMock.mockResolvedValue({ secure_url: "url1", public_id: "id1" });
    pictureRepoMock.createPicture.mockRejectedValue(new Error("DB error"));

    await expect(locationService.createLocation(data))
      .rejects
      .toThrow("DB error");

    // Cloudinary destroy doit être appelé
    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("id1");
  });
});
