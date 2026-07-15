import { jest } from "@jest/globals";
import PostRepository from "../../repositories/PostRepository.js";

describe("PostRepository", () => {

  let prismaMock;
  let repo;

  beforeEach(() => {
    prismaMock = {
      post: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };

    repo = new PostRepository(prismaMock);
  });

  // ---------------------------------------------------------
  // createPost
  // ---------------------------------------------------------
  test("createPost should call prisma.post.create with correct params", async () => {
    const data = {
      title: "My Post",
      content: "Hello world",
      pictureId: "p1"
    };

    const fakePost = { id: 1, ...data };
    prismaMock.post.create.mockResolvedValue(fakePost);

    const result = await repo.createPost(data);

    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data,
      include: { picture: true }
    });

    expect(result).toEqual(fakePost);
  });

  test("createPost should throw if prisma throws", async () => {
    prismaMock.post.create.mockRejectedValue(new Error("DB error"));

    await expect(repo.createPost({ title: "Test" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getPostById
  // ---------------------------------------------------------
  test("getPostById should call prisma.post.findUnique with correct params", async () => {
    const fakePost = { id: "1" };
    prismaMock.post.findUnique.mockResolvedValue(fakePost);

    const result = await repo.getPostById("1");

    expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { picture: true }
    });

    expect(result).toEqual(fakePost);
  });

  test("getPostById should throw if prisma throws", async () => {
    prismaMock.post.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repo.getPostById("1"))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // getAllPost
  // ---------------------------------------------------------
  test("getAllPost should call prisma.post.findMany", async () => {
    const fakePosts = [{ id: 1 }, { id: 2 }];
    prismaMock.post.findMany.mockResolvedValue(fakePosts);

    const result = await repo.getAllPost();

    expect(prismaMock.post.findMany).toHaveBeenCalledWith({
      include: { picture: true },
      orderBy: { createdAt: "desc" }
    });

    expect(result).toEqual(fakePosts);
  });

  test("getAllPost should throw if prisma throws", async () => {
    prismaMock.post.findMany.mockRejectedValue(new Error("DB error"));

    await expect(repo.getAllPost())
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // updatePost
  // ---------------------------------------------------------
  test("updatePost should call prisma.post.update with correct params", async () => {
    const data = {
      title: "Updated",
      content: "Updated content"
    };

    const fakePost = { id: "1", ...data };
    prismaMock.post.update.mockResolvedValue(fakePost);

    const result = await repo.updatePost("1", data);

    expect(prismaMock.post.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data,
      include: { picture: true }
    });

    expect(result).toEqual(fakePost);
  });

  test("updatePost should throw if prisma throws", async () => {
    prismaMock.post.update.mockRejectedValue(new Error("DB error"));

    await expect(repo.updatePost("1", { title: "Updated" }))
      .rejects
      .toThrow("DB error");
  });

  // ---------------------------------------------------------
  // deletePost
  // ---------------------------------------------------------
  test("deletePost should call prisma.post.delete with correct params", async () => {
    const fakePost = { id: "1" };
    prismaMock.post.delete.mockResolvedValue(fakePost);

    const result = await repo.deletePost("1");

    expect(prismaMock.post.delete).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { picture: true }
    });

    expect(result).toEqual(fakePost);
  });

  test("deletePost should throw if prisma throws", async () => {
    prismaMock.post.delete.mockRejectedValue(new Error("DB error"));

    await expect(repo.deletePost("1"))
      .rejects
      .toThrow("DB error");
  });

});
