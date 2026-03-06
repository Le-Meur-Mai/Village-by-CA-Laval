// __tests__/services/userServices.test.js
import { jest } from "@jest/globals";

// -----------------------------
// Mocks avant import
// -----------------------------

// Repository mock
const userRepoMock = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

// StartUpServices mock
const startUpServiceMock = {
  deleteStartUp: jest.fn(),
};

// QuoteServices mock
const quoteServiceMock = {
  deleteQuote: jest.fn(),
};

// hashPassword mock
const hashPasswordMock = jest.fn();

// -----------------------------
// Mock des modules AVANT import du service
// -----------------------------
await jest.unstable_mockModule("../../repositories/UserRepository.js", () => ({
  default: jest.fn(() => userRepoMock),
}));

await jest.unstable_mockModule("../../services/startUpServices.js", () => ({
  default: jest.fn(() => startUpServiceMock),
}));

await jest.unstable_mockModule("../../services/quoteServices.js", () => ({
  default: jest.fn(() => quoteServiceMock),
}));

await jest.unstable_mockModule("../../utils/hashPassword.js", () => ({
  default: hashPasswordMock,
}));

// Import du service APRÈS les mocks
const { default: UserServices } = await import("../../services/userServices.js");
const Errors = await import("../../errors/errorsClasses.js");

// -----------------------------
// Tests
// -----------------------------
describe("UserServices - full test suite", () => {
  let userService;

  beforeEach(() => {
    // Reset des mocks
    Object.values(userRepoMock).forEach(fn => fn.mockReset());
    Object.values(startUpServiceMock).forEach(fn => fn.mockReset());
    Object.values(quoteServiceMock).forEach(fn => fn.mockReset());
    hashPasswordMock.mockReset();

    // Valeur par défaut du hash
    hashPasswordMock.mockResolvedValue("hashedPassword");

    userService = new UserServices();
  });

  // CREATE
  test("createUser should hash password and create user", async () => {
    const data = {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Alice",
      email: "alice@test.com",
      password: "password123",
      isAdmin: false,
    };

    userRepoMock.createUser.mockResolvedValue(data);

    const result = await userService.createUser(data);

    expect(hashPasswordMock).toHaveBeenCalledWith("password123");
    expect(userRepoMock.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashedPassword",
        isAdmin: false,
      })
    );
    expect(result).toEqual(data);
  });

  // GET BY ID
  test("getUserById should return user if exists", async () => {
    const user = { id: "22222222-2222-2222-2222-222222222222", name: "Bob" };
    userRepoMock.getUserById.mockResolvedValue(user);

    const result = await userService.getUserById(user.id);

    expect(userRepoMock.getUserById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });

  test("getUserById should throw NotFoundError if user doesn't exist", async () => {
    userRepoMock.getUserById.mockResolvedValue(null);

    await expect(
      userService.getUserById("33333333-3333-3333-3333-333333333333")
    ).rejects.toThrow(Errors.NotFoundError);
  });

  // GET ALL
  test("getAllUsers should return all users", async () => {
    const users = [
      { id: "1".repeat(36) },
      { id: "2".repeat(36) },
    ];

    userRepoMock.getAllUsers.mockResolvedValue(users);

    const result = await userService.getAllUsers();

    expect(result).toEqual(users);
  });

  // UPDATE
  test("updateUser should update user if exists and admin changes password", async () => {
    const existingUser = {
      id: "44444444-4444-4444-4444-444444444444",
      name: "Charlie",
      email: "charlie@test.com",
    };

    const data = { name: "Charles", password: "newpass" };

    userRepoMock.getUserById.mockResolvedValue(existingUser);
    userRepoMock.updateUser.mockResolvedValue({
      ...existingUser,
      ...data,
      password: "hashedPassword",
    });

    const result = await userService.updateUser(existingUser.id, data, true);

    expect(hashPasswordMock).toHaveBeenCalledWith("newpass");
    expect(userRepoMock.updateUser).toHaveBeenCalledWith(
      existingUser.id,
      expect.objectContaining({ password: "hashedPassword" })
    );
    expect(result.name).toBe("Charles");
  });

  test("updateUser should throw ForbiddenError if non-admin tries to change password", async () => {
    const existingUser = {
      id: "55555555-5555-5555-5555-555555555555",
      name: "Dana",
    };

    const data = { password: "newpass" };

    userRepoMock.getUserById.mockResolvedValue(existingUser);

    await expect(
      userService.updateUser(existingUser.id, data, false)
    ).rejects.toThrow(Errors.ForbiddenError);
  });

  // DELETE
  test("deleteUser should delete quotes and startup and then user", async () => {
    const user = {
      id: "66666666-6666-6666-6666-666666666666",
      quotes: [{ id: "q1".repeat(9) }],
      startUp: { id: "s1".repeat(9) },
    };

    userRepoMock.getUserById.mockResolvedValue(user);
    userRepoMock.deleteUser.mockResolvedValue("deleted");

    quoteServiceMock.deleteQuote.mockResolvedValue(true);
    startUpServiceMock.deleteStartUp.mockResolvedValue(true);

    const result = await userService.deleteUser(user.id);

    expect(quoteServiceMock.deleteQuote).toHaveBeenCalledWith(user.quotes[0].id);
    expect(startUpServiceMock.deleteStartUp).toHaveBeenCalledWith(
      user.startUp.id,
      expect.anything()
    );
    expect(userRepoMock.deleteUser).toHaveBeenCalledWith(
      user.id,
      expect.anything()
    );
    expect(result).toBe("deleted");
  });

  test("deleteUser should throw NotFoundError if user doesn't exist", async () => {
    userRepoMock.getUserById.mockResolvedValue(null);

    await expect(
      userService.deleteUser("77777777-7777-7777-7777-777777777777")
    ).rejects.toThrow(Errors.NotFoundError);
  });
});
