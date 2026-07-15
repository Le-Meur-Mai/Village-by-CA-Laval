import { jest } from "@jest/globals";

// -----------------------------
// Mocks des repositories
// -----------------------------

const quoteRepoMock = {
  createQuote: jest.fn(),
  getQuoteById: jest.fn(),
  getQuotesByUser: jest.fn(),
  getQuoteByDescription: jest.fn(),
  getAllQuotes: jest.fn(),
  updateQuote: jest.fn(),
  deleteQuote: jest.fn(),
};

const userRepoMock = {
  getUserById: jest.fn(),
};

// -----------------------------
// Importation des modules après mock
// -----------------------------

await jest.unstable_mockModule("../../repositories/QuoteRepository.js", () => ({
  default: jest.fn(() => quoteRepoMock),
}));

await jest.unstable_mockModule("../../repositories/UserRepository.js", () => ({
  default: jest.fn(() => userRepoMock),
}));

const { default: QuoteServices } = await import("../../services/quoteServices.js");
const Errors = await import("../../errors/errorsClasses.js");

// -----------------------------
// Tests
// -----------------------------

describe("QuoteServices", () => {
  let quoteService;

  beforeEach(() => {
    jest.clearAllMocks();
    quoteService = new QuoteServices();
    quoteRepoMock.getQuoteByDescription.mockResolvedValue(null);
  });

  // -----------------------------
  // createQuote
  // -----------------------------
  test("createQuote should succeed if user exists", async () => {
    const data = {
      firstName: "Alice",
      lastName: "Doe",
      description: "Test quote",
      userId: "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7",
    };
    const fakeUser = { id: "user-1", email: "alice@test.com" };
    userRepoMock.getUserById.mockResolvedValue(fakeUser);
    quoteRepoMock.createQuote.mockResolvedValue({ id: "quote-1", ...data });

    const result = await quoteService.createQuote(data);

    expect(userRepoMock.getUserById).toHaveBeenCalledWith("8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7");
    expect(quoteRepoMock.createQuote).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: "quote-1", ...data });
  });

  test("createQuote should throw NotFoundError if user does not exist", async () => {
    const data = {
      firstName: "Alice",
      lastName: "Doe",
      description: "Test quote",
      userId: "user-1",
    };
    userRepoMock.getUserById.mockResolvedValue(null);

    await expect(quoteService.createQuote(data)).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // getQuoteById
  // -----------------------------
  test("getQuoteById should return the quote if exists", async () => {
    const fakeQuote = {
      id: "quote-1",
      firstName: "Alice",
      lastName: "Doe",
      description: "Hello",
      user: { id: "user-1" },
    };
    quoteRepoMock.getQuoteById.mockResolvedValue(fakeQuote);

    const result = await quoteService.getQuoteById("quote-1");

    expect(quoteRepoMock.getQuoteById).toHaveBeenCalledWith("quote-1");
    expect(result).toEqual(fakeQuote);
  });

  test("getQuoteById should throw NotFoundError if quote does not exist", async () => {
    quoteRepoMock.getQuoteById.mockResolvedValue(null);

    await expect(quoteService.getQuoteById("quote-1")).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // getQuotesByUser
  // -----------------------------
  test("getQuotesByUser should return quotes if user exists", async () => {
    const fakeUser = { id: "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7" };
    const quotes = [
      { id: "q1", firstName: "Alice", lastName: "Doe", description: "Q1", userId: "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7" },
      { id: "q2", firstName: "Bob", lastName: "Smith", description: "Q2", userId: "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7" },
    ];
    userRepoMock.getUserById.mockResolvedValue(fakeUser.id);
    quoteRepoMock.getQuotesByUser.mockResolvedValue(quotes);

    const result = await quoteService.getQuotesByUser("8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7");

    expect(userRepoMock.getUserById).toHaveBeenCalledWith("8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7");
    expect(quoteRepoMock.getQuotesByUser).toHaveBeenCalledWith("8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7");
    expect(result).toEqual(quotes);
  });

  test("getQuotesByUser should throw NotFoundError if user does not exist", async () => {
    userRepoMock.getUserById.mockResolvedValue(null);

    await expect(quoteService.getQuotesByUser("user-1")).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // updateQuote
  // -----------------------------
  test("updateQuote should update quote if exists and user is owner", async () => {
    const userId = "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7";

    const existingQuote = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      firstName: "Alice",
      lastName: "Doe",
      description: "Old description",
      userId: userId,
    };

    const data = {
      description: "New description",
      firstName: "Alice",
      lastName: "Doe",
      userId: userId // même owner → pas de Forbidden
    };

    quoteRepoMock.getQuoteById.mockResolvedValue(existingQuote);

    quoteRepoMock.updateQuote.mockResolvedValue({
      ...existingQuote,
      ...data
    });

    const result = await quoteService.updateQuote(
      existingQuote.id,
      data,
      { id: userId, isAdmin: false }
    );

    expect(quoteRepoMock.getQuoteById).toHaveBeenCalledWith(existingQuote.id);

    expect(quoteRepoMock.updateQuote).toHaveBeenCalledWith(
      existingQuote.id,
      data
    );

    expect(result.description).toBe("New description");
  });

  test("updateQuote should throw NotFoundError if quote does not exist", async () => {
    quoteRepoMock.getQuoteById.mockResolvedValue(null);

    await expect(
      quoteService.updateQuote("quote-1", { description: "New" }, { id: "8f3c2c4e-7b8a-4f0e-9c2a-1d8b6f4e92a7", isAdmin: false })
    ).rejects.toThrow(Errors.NotFoundError);
  });

  test("updateQuote should throw ForbiddenError if user tries to change owner without admin", async () => {
    const existingQuote = {
      id: "quote-1",
      firstName: "Alice",
      lastName: "Doe",
      description: "Old description",
      user: { id: "user-1" },
    };
    quoteRepoMock.getQuoteById.mockResolvedValue(existingQuote);

    await expect(
      quoteService.updateQuote("quote-1", { userId: "user-2" }, { id: "user-1", isAdmin: false })
    ).rejects.toThrow(Errors.ForbiddenError);
  });

  // -----------------------------
  // deleteQuote
  // -----------------------------
  test("deleteQuote should delete if user is owner", async () => {
    const existingQuote = {
      id: "quote-1",
      firstName: "Alice",
      lastName: "Doe",
      description: "Some description",
      user: { id: "user-1" },
    };
    quoteRepoMock.getQuoteById.mockResolvedValue(existingQuote);
    quoteRepoMock.deleteQuote.mockResolvedValue(existingQuote);

    const result = await quoteService.deleteQuote("quote-1", { id: "user-1", isAdmin: false });

    expect(quoteRepoMock.deleteQuote).toHaveBeenCalledWith("quote-1");
    expect(result).toEqual(existingQuote);
  });

  test("deleteQuote should delete if user is admin", async () => {
    const existingQuote = {
      id: "quote-1",
      firstName: "Alice",
      lastName: "Doe",
      description: "Some description",
      user: { id: "user-2" },
    };
    quoteRepoMock.getQuoteById.mockResolvedValue(existingQuote);
    quoteRepoMock.deleteQuote.mockResolvedValue(existingQuote);

    const result = await quoteService.deleteQuote("quote-1", { id: "user-1", isAdmin: true });

    expect(quoteRepoMock.deleteQuote).toHaveBeenCalledWith("quote-1");
    expect(result).toEqual(existingQuote);
  });

  test("deleteQuote should throw ForbiddenError if user is not owner/admin", async () => {
    const existingQuote = {
      id: "quote-1",
      firstName: "Alice",
      lastName: "Doe",
      description: "Some description",
      user: { id: "user-2" },
    };
    quoteRepoMock.getQuoteById.mockResolvedValue(existingQuote);

    await expect(
      quoteService.deleteQuote("quote-1", { id: "user-3", isAdmin: false })
    ).rejects.toThrow(Errors.ForbiddenError);
  });
});
