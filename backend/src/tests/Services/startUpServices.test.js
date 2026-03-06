import { jest } from "@jest/globals";
import StartUpServices from "../../services/startUpServices.js"
import * as Errors from "../../errors/errorsClasses.js"

jest.mock("../../prismaClient.js", () => ({
  $transaction: jest.fn((callback) => callback({}))
}))

jest.mock("../../utils/uploadToCloudinary.js")

jest.mock("../../../config/cloudinary.js", () => ({
  uploader: {
    destroy: jest.fn()
  }
}))

describe("StartUpServices - full test suite", () => {

  let service

  let startUpRepoMock
  let typeRepoMock
  let userRepoMock
  let pictureRepoMock

  const USER_ID = "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7"
  const STARTUP_ID = "550e8400-e29b-41d4-a716-446655440001"
  const LOGO_ID = "550e8400-e29b-41d4-a716-446655440002"
  const DESC_PIC_ID = "550e8400-e29b-41d4-a716-446655440003"

  beforeEach(() => {

    startUpRepoMock = {
      createStartUp: jest.fn(),
      getStartUpById: jest.fn(),
      getAllStartUps: jest.fn(),
      updateStartUp: jest.fn(),
      deleteStartUp: jest.fn()
    }

    typeRepoMock = {
      getTypeById: jest.fn()
    }

    userRepoMock = {
      getUserById: jest.fn()
    }

    pictureRepoMock = {
      createPicture: jest.fn(),
      getPictureById: jest.fn(),
      deletePicture: jest.fn()
    }

    service = new StartUpServices()

    service.startUpRepo = startUpRepoMock
    service.typeRepo = typeRepoMock
    service.userRepo = userRepoMock
    service.pictureRepo = pictureRepoMock

    jest.clearAllMocks()
  })

  test("createStartUp should create startup if user exists", async () => {

    const data = {
      name: "MyStartUp",
      description: "description",
      isAlumni: false,
      website: "https://startup.com",
      userId: USER_ID,
      logoId: LOGO_ID,
      descriptionPictureId: DESC_PIC_ID
    }

    userRepoMock.getUserById.mockResolvedValue({ id: USER_ID })

    startUpRepoMock.createStartUp.mockResolvedValue({
      id: STARTUP_ID,
      ...data
    })

    const result = await service.createStartUp(data)

    expect(userRepoMock.getUserById).toHaveBeenCalledWith(USER_ID, {})
    expect(startUpRepoMock.createStartUp).toHaveBeenCalled()

    expect(result.id).toBe(STARTUP_ID)

  })

  test("createStartUp should throw NotFoundError if user doesn't exist", async () => {

    const data = {
      name: "MyStartUp",
      isAlumni: false,
      userId: USER_ID,
      logoId: LOGO_ID,
      descriptionPictureId: DESC_PIC_ID
    }

    userRepoMock.getUserById.mockResolvedValue(null)

    await expect(service.createStartUp(data))
      .rejects
      .toThrow(Errors.NotFoundError)

  })

  test("getStartUpById should return startup", async () => {

    const startup = {
      id: STARTUP_ID,
      name: "Startup",
      isAlumni: false,
      userId: USER_ID,
      logoId: LOGO_ID,
      descriptionPictureId: DESC_PIC_ID
    }

    startUpRepoMock.getStartUpById.mockResolvedValue(startup)

    const result = await service.getStartUpById(STARTUP_ID)

    expect(result).toEqual(startup)

  })

  test("getStartUpById should throw NotFoundError if startup doesn't exist", async () => {

    startUpRepoMock.getStartUpById.mockResolvedValue(null)

    await expect(service.getStartUpById(STARTUP_ID))
      .rejects
      .toThrow(Errors.NotFoundError)

  })

  test("getAllStartUps should return startups", async () => {

    const startups = [
      { id: STARTUP_ID },
      { id: "550e8400-e29b-41d4-a716-446655440010" }
    ]

    startUpRepoMock.getAllStartUps.mockResolvedValue(startups)

    const result = await service.getAllStartUps()

    expect(result).toEqual(startups)

  })

  test("updateStartUp should update startup if owner", async () => {

    const existingStartup = {
      id: STARTUP_ID,
      name: "Startup",
      isAlumni: false,
      userId: USER_ID,
      logoId: LOGO_ID,
      descriptionPictureId: DESC_PIC_ID,
      user: { id: USER_ID }
    }

    startUpRepoMock.getStartUpById.mockResolvedValue(existingStartup)

    startUpRepoMock.updateStartUp.mockResolvedValue({
      ...existingStartup,
      name: "UpdatedStartup"
    })

    const result = await service.updateStartUp(
      STARTUP_ID,
      { name: "UpdatedStartup" },
      { id: USER_ID, isAdmin: false }
    )

    expect(startUpRepoMock.updateStartUp).toHaveBeenCalled()
    expect(result.name).toBe("UpdatedStartup")

  })

  test("updateStartUp should throw ForbiddenError if not owner", async () => {

    const existingStartup = {
      id: STARTUP_ID,
      user: { id: USER_ID }
    }

    startUpRepoMock.getStartUpById.mockResolvedValue(existingStartup)

    await expect(
      service.updateStartUp(
        STARTUP_ID,
        { name: "Update" },
        { id: "550e8400-e29b-41d4-a716-446655440099", isAdmin: false }
      )
    ).rejects.toThrow(Errors.ForbiddenError)

  })

  test("deleteStartUp should delete startup", async () => {

    const startup = {
      id: STARTUP_ID,
      logoId: "Id par défaut",
      descriptionPictureId: "Id par défaut",
      logo: { publicId: "logo" },
      descriptionPicture: { publicId: "desc" }
    }

    startUpRepoMock.getStartUpById.mockResolvedValue(startup)

    startUpRepoMock.deleteStartUp.mockResolvedValue(startup)

    const result = await service.deleteStartUp(STARTUP_ID)

    expect(startUpRepoMock.deleteStartUp).toHaveBeenCalled()

    expect(result).toEqual(startup)

  })

  test("deleteStartUp should throw NotFoundError if startup doesn't exist", async () => {

    startUpRepoMock.getStartUpById.mockResolvedValue(null)

    await expect(service.deleteStartUp(STARTUP_ID))
      .rejects
      .toThrow(Errors.NotFoundError)

  })

})
