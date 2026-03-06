// src/tests/services/authServices.test.js
import { jest } from "@jest/globals";

// -----------------------------
// Définition des mocks avant import
// -----------------------------

/*Avec ESM, quand on écrit import, le module est chargé immédiatement.
Si on fait ensuite un jest.mock() classique ou mockImplementation(),
c’est trop tard, le vrai module est déjà dans la mémoire.
Résultat : on ne peut pas remplacer la classe par un mock et on obtient des
erreurs car on veut simuler UserRepository et checkpassword*/

/*Si on ne mocke pas ces dépendances :

UserRepository va utiliser le vrai prisma et accéder à la vraie base de données
→ le test n’est plus isolé, et il devient fragile/dépendant de la DB.

checkPassword va exécuter le vrai hash bcrypt → inutile pour le test unitaire,
et ça complique la simulation de mot de passe correct ou incorrect.
On veut juste vérifier la logique du auth service.*/

// Faux repo
const userRepoMock = {
  findUserByEmail: jest.fn()
};

// Faux checkPassword
const checkPasswordMock = jest.fn();

// Mock du module UserRepository quand on l'importe on utilise un mock à la place
await jest.unstable_mockModule("../../repositories/UserRepository.js", () => ({
  default: jest.fn(() => userRepoMock)
}));

// Mock du module checkPassword
await jest.unstable_mockModule("../../utils/checkPassword.js", () => ({
  default: checkPasswordMock
}));

// Mock de prisma (on peut importer directement)
import prisma from "../../prismaClient.js";

// Import du service après les mocks sinon les faux repo et checkpassword ne seraient pas chargés
const { default: AuthServices } = await import("../../services/authServices.js");
const Errors = await import("../../errors/errorsClasses.js");

// -----------------------------
// Tests
// -----------------------------
describe("AuthServices", () => {
  let authService;

  beforeEach(() => {
    // Reset des mocks avant chaque test
    userRepoMock.findUserByEmail.mockReset();
    checkPasswordMock.mockReset();
    prisma.$transaction = jest.fn(async (callback) => callback({}));

    authService = new AuthServices();
  });

  // -----------------------------
  // Valid Login
  // -----------------------------
  test("login should return id and isAdmin when credentials are valid", async () => {
    const fakeUser = { id: "1", email: "test@test.com", password: "hashed", isAdmin: true };

    userRepoMock.findUserByEmail.mockResolvedValue(fakeUser);
    checkPasswordMock.mockResolvedValue(true);

    const result = await authService.login({ email: "test@test.com", password: "1234" });

    expect(userRepoMock.findUserByEmail).toHaveBeenCalledWith("test@test.com", {});
    expect(checkPasswordMock).toHaveBeenCalledWith("1234", "hashed");
    expect(result).toEqual({ id: "1", isAdmin: true });
  });

  // -----------------------------
  // Invalid Login
  // -----------------------------

  test("login should throw NotFoundError if user does not exist", async () => {
    userRepoMock.findUserByEmail.mockResolvedValue(null);
    checkPasswordMock.mockResolvedValue(true);

    await expect(authService.login({ email: "unknown@test.com", password: "1234" }))
      .rejects
      .toThrow(Errors.NotFoundError);
  });

  test("login should throw if password is incorrect", async () => {
    const fakeUser = { id: "1", email: "test@test.com", password: "hashed", isAdmin: false };

    userRepoMock.findUserByEmail.mockResolvedValue(fakeUser);
    checkPasswordMock.mockRejectedValue(new Error("Invalid password"));

    await expect(authService.login({ email: "test@test.com", password: "wrong" }))
      .rejects
      .toThrow("Invalid password");
  });

  test("login should throw if prisma.$transaction throws", async () => {
    prisma.$transaction.mockRejectedValue(new Error("DB error"));

    await expect(authService.login({ email: "test@test.com", password: "1234" }))
      .rejects
      .toThrow("DB error");
  });
});
