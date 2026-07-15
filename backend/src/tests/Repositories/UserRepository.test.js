import UserRepository from "../../repositories/UserRepository.js";
import { jest } from '@jest/globals';

describe("UserRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    // Un objet JavaScript qui imite le vrai client Prisma, mais sans jamais parler à notre db
    prismaMock = {
      user: {
        /* Fausses fonctions mock jest qui pourront dire ensuite si elles auront
        été appelées et par quoi. On peut leur définir des retours également.
        prismaMock va donc simuler le client prisma avec les fausses fonctions et
        on va pouvoir récupérer toutes les infos qui sont transmises ou pas. */
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new UserRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createUser
  // ---------------------------------------------------------
  test("createUser should call prisma.user.create with correct params", async () => {
    const data = { name: "Alice" };
    const fakeUser = { id: 1, name: "Alice" };

    prismaMock.user.create.mockResolvedValue(fakeUser);

    const result = await repo.createUser(data);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data,
      include: {
        quotes: true,
        startUp: true
      }
    });

    expect(result).toEqual(fakeUser);
  });

  test("createUser should throw if prisma throws", async () => {
    prismaMock.user.create.mockRejectedValue(new Error("DB error"));

    await expect(repo.createUser({ name: "Alice" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getUserById
  // ---------------------------------------------------------
  test("getUserById should call prisma.user.findUnique with correct params", async () => {
    const fakeUser = { id: "1", name: "Alice" };
    prismaMock.user.findUnique.mockResolvedValue(fakeUser);

    const result = await repo.getUserById("1");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        quotes: true,
        startUp: {
          include: {
            logo: true,
            descriptionPicture: true,
            types: true
          }
        }
      }
    });

    expect(result).toEqual(fakeUser);
  });


  test("getUserById should throw if prisma throws", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getUserById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllUsers
  // ---------------------------------------------------------
  test("getAllUsers should call prisma.user.findMany", async () => {
    const fakeUsers = [{ id: 1 }, { id: 2 }];
    prismaMock.user.findMany.mockResolvedValue(fakeUsers);

    const result = await repo.getAllUsers();

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      include: {
        quotes: true,
        startUp: true
      }
    });

    expect(result).toEqual(fakeUsers);
  });

  test("getAllUsers should throw if prisma throws", async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllUsers())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // findUserByEmail
  // ---------------------------------------------------------
  test("findUserByEmail should call prisma.user.findUnique with correct params", async () => {
    const fakeUser = { id: 1, email: "test@test.com" };
    prismaMock.user.findUnique.mockResolvedValue(fakeUser);

    const result = await repo.findUserByEmail("test@test.com");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@test.com" },
      include: {
        quotes: true,
        startUp: true
      }
    });

    expect(result).toEqual(fakeUser);
  });

  test("findUserByEmail should throw if prisma throws", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.findUserByEmail("test@test.com"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updateUser
  // ---------------------------------------------------------
  test("updateUser should call prisma.user.update with correct params", async () => {
    const fakeUser = { id: 1, name: "Updated" };
    prismaMock.user.update.mockResolvedValue(fakeUser);

    const result = await repo.updateUser("1", { name: "Updated" });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { name: "Updated" },
      include: {
        quotes: true,
        startUp: true
      }
    });

    expect(result).toEqual(fakeUser);
  });

  test("updateUser should throw if prisma throws", async () => {
    prismaMock.user.update.mockRejectedValue(new Error("DB error"));

    await expect(repo.updateUser("1", { name: "Updated" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deleteUser
  // ---------------------------------------------------------
  test("deleteUser should call prisma.user.delete with correct params", async () => {
    const fakeUser = { id: 1 };
    prismaMock.user.delete.mockResolvedValue(fakeUser);

    const result = await repo.deleteUser("1");

    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        quotes: true,
        startUp: true
      }
    });

    expect(result).toEqual(fakeUser);
  });

  test("deleteUser should throw if prisma throws", async () => {
    prismaMock.user.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deleteUser("1"))
      .rejects
      .toThrow("DB error");
  });

});