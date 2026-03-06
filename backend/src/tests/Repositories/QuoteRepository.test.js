import { jest } from "@jest/globals";
import QuoteRepository from "../../repositories/QuoteRepository.js";

describe("QuoteRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      quote: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new QuoteRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createQuote
  // ---------------------------------------------------------
  test("createQuote should call prisma.quote.create with correct params", async () => {
    const data = { content: "Hello", userId: "u1" };
    const fakeQuote = { id: 1, ...data };

    prismaMock.quote.create.mockResolvedValue(fakeQuote);

    const result = await repo.createQuote(data);

    expect(prismaMock.quote.create).toHaveBeenCalledWith({
      data,
      include: { user: true }
    });

    expect(result).toEqual(fakeQuote);
  });

  test("createQuote should throw if prisma throws", async () => {
    prismaMock.quote.create.mockRejectedValue(new Error("DB error"));

    await expect(repo.createQuote({ content: "Hello" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getQuoteById
  // ---------------------------------------------------------
  test("getQuoteById should call prisma.quote.findUnique with correct params", async () => {
    const fakeQuote = { id: "1" };
    prismaMock.quote.findUnique.mockResolvedValue(fakeQuote);

    const result = await repo.getQuoteById("1");

    expect(prismaMock.quote.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: {
        user: {
          include: {
            startUp: {
              include: {
                logo: true
              }
            }
          }
        }
      }
    });

    expect(result).toEqual(fakeQuote);
  });

  test("getQuoteById should throw if prisma throws", async () => {
    prismaMock.quote.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getQuoteById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getQuotesByUser
  // ---------------------------------------------------------
  test("getQuotesByUser should call prisma.quote.findMany with correct params", async () => {
    const fakeQuotes = [{ id: 1 }, { id: 2 }];
    prismaMock.quote.findMany.mockResolvedValue(fakeQuotes);

    const result = await repo.getQuotesByUser("u1");

    expect(prismaMock.quote.findMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
      include: {
        user: {
          include: {
            startUp: {
              include: {
                logo: true
              }
            }
          }
        }
      }
    });

    expect(result).toEqual(fakeQuotes);
  });

  test("getQuotesByUser should throw if prisma throws", async () => {
    prismaMock.quote.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getQuotesByUser("u1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllQuotes
  // ---------------------------------------------------------
  test("getAllQuotes should call prisma.quote.findMany", async () => {
    const fakeQuotes = [{ id: 1 }, { id: 2 }];
    prismaMock.quote.findMany.mockResolvedValue(fakeQuotes);

    const result = await repo.getAllQuotes();

    expect(prismaMock.quote.findMany).toHaveBeenCalledWith({
      include: {
        user: {
          include: {
            startUp: {
              include: {
                logo: true
              }
            }
          }
        }
      }
    });

    expect(result).toEqual(fakeQuotes);
  });

  test("getAllQuotes should throw if prisma throws", async () => {
    prismaMock.quote.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllQuotes())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updateQuote
  // ---------------------------------------------------------
  test("updateQuote should call prisma.quote.update with correct params", async () => {
    const data = { content: "Updated" };
    const fakeQuote = { id: "1", ...data };

    prismaMock.quote.update.mockResolvedValue(fakeQuote);

    const result = await repo.updateQuote("1", data);

    expect(prismaMock.quote.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data,
      include: { user: true }
    });

    expect(result).toEqual(fakeQuote);
  });

  test("updateQuote should throw if prisma throws", async () => {
    prismaMock.quote.update.mockRejectedValue(new Error("DB error"));

    await expect(repo.updateQuote("1", { content: "Updated" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deleteQuote
  // ---------------------------------------------------------
  test("deleteQuote should call prisma.quote.delete with correct params", async () => {
    const fakeQuote = { id: "1" };
    prismaMock.quote.delete.mockResolvedValue(fakeQuote);

    const result = await repo.deleteQuote("1");

    expect(prismaMock.quote.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { user: true }
    });

    expect(result).toEqual(fakeQuote);
  });

  test("deleteQuote should throw if prisma throws", async () => {
    prismaMock.quote.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deleteQuote("1"))
      .rejects
      .toThrow("DB error");
  });

});
