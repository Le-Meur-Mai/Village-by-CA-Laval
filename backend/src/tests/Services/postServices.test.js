// src/tests/services/postServices.test.js
import { jest } from "@jest/globals";

// -----------------------------
// Mocks avant import
// -----------------------------
const postRepoMock = {
  createPost: jest.fn(),
  getPostById: jest.fn(),
  getAllPost: jest.fn(),
  getPostByTitle: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn()
};

const pictureRepoMock = {
  createPicture: jest.fn(),
  deletePicture: jest.fn()
};

const PostMock = jest.fn();
const uploadPictureMock = jest.fn();

const cloudinaryMock = {
  uploader: {
    destroy: jest.fn()
  }
};

// Mock des modules avant import du service
await jest.unstable_mockModule("../../repositories/PostRepository.js", () => ({
  default: jest.fn(() => postRepoMock)
}));

await jest.unstable_mockModule("../../repositories/PictureRepository.js", () => ({
  default: jest.fn(() => pictureRepoMock)
}));

await jest.unstable_mockModule("../../classes/Post.js", () => ({
  default: PostMock
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
const { default: PostServices } = await import("../../services/postServices.js");
const Errors = await import("../../errors/errorsClasses.js");

// -----------------------------
// Tests
// -----------------------------
describe("PostServices", () => {
  let postService;

  beforeEach(() => {
    // Reset des mocks
    Object.values(postRepoMock).forEach(fn => fn.mockReset());
    Object.values(pictureRepoMock).forEach(fn => fn.mockReset());
    PostMock.mockReset();
    uploadPictureMock.mockReset();
    cloudinaryMock.uploader.destroy.mockReset();

    // Mock Prisma transaction
    prisma.$transaction = jest.fn(async (callback) => callback({}));

    postService = new PostServices();

    postRepoMock.getPostByTitle.mockResolvedValue(null);
  });

  test("createPost with picture", async () => {
    const data = { title: "Test Post", picture: "file1" };
    uploadPictureMock.mockResolvedValue({ secure_url: "url1", public_id: "id1" });
    pictureRepoMock.createPicture.mockResolvedValue({ id: 201 });
    postRepoMock.createPost.mockResolvedValue({ id: 1, title: data.title, pictureId: 201 });

    const result = await postService.createPost({ ...data });

    expect(uploadPictureMock).toHaveBeenCalledWith("file1", "Posts");
    expect(pictureRepoMock.createPicture).toHaveBeenCalledWith({ secureUrl: "url1", publicId: "id1" }, {});
    expect(postRepoMock.createPost).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, title: "Test Post", pictureId: 201 });
  });

  test("createPost without picture", async () => {
    const data = { title: "Post no picture" };
    postRepoMock.createPost.mockResolvedValue({ id: 2, title: data.title });

    const result = await postService.createPost({ ...data });

    expect(uploadPictureMock).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 2, title: data.title });
  });

  test("createPost cleanup Cloudinary on error", async () => {
    const data = { title: "Fail Post", picture: "file2" };
    uploadPictureMock.mockResolvedValue({ secure_url: "url2", public_id: "id2" });
    pictureRepoMock.createPicture.mockRejectedValue(new Error("DB error"));

    await expect(postService.createPost({ ...data })).rejects.toThrow("DB error");
    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("id2");
  });

  // -----------------------------
  // GET BY ID
  // -----------------------------
  test("getPostById returns post", async () => {
    postRepoMock.getPostById.mockResolvedValue({ id: 1, title: "Post1" });

    const result = await postService.getPostById(1);

    expect(postRepoMock.getPostById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, title: "Post1" });
  });

  test("getPostById throws NotFoundError if not exists", async () => {
    postRepoMock.getPostById.mockResolvedValue(null);

    await expect(postService.getPostById(999)).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // GET ALL
  // -----------------------------
  test("getAllPosts returns posts", async () => {
    postRepoMock.getAllPost.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await postService.getAllPosts();

    expect(postRepoMock.getAllPost).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  // -----------------------------
  // UPDATE
  // -----------------------------
  test("updatePost with new picture", async () => {
    const data = { title: "Updated", picture: "newfile" };
    const existingPost = { id: 1, title: "Old Post", picture: { id: 301, publicId: "oldId" } };

    postRepoMock.getPostById.mockResolvedValue(existingPost);
    uploadPictureMock.mockResolvedValue({ secure_url: "urlNew", public_id: "newId" });
    pictureRepoMock.createPicture.mockResolvedValue({ id: 302 });
    postRepoMock.updatePost.mockResolvedValue({ id: 1, title: "Updated", pictureId: 302 });

    const result = await postService.updatePost(1, data);

    expect(uploadPictureMock).toHaveBeenCalledWith("newfile", "Posts");
    expect(pictureRepoMock.createPicture).toHaveBeenCalledWith({ secureUrl: "urlNew", publicId: "newId" }, {});
    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("oldId");
    expect(pictureRepoMock.deletePicture).toHaveBeenCalledWith(301, {});
    expect(postRepoMock.updatePost).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, title: "Updated", pictureId: 302 });
  });

  test("updatePost without picture", async () => {
    const data = { title: "Updated" };
    const existingPost = { id: 1, title: "Old Post", picture: { id: 301, publicId: "oldId" } };

    postRepoMock.getPostById.mockResolvedValue(existingPost);
    postRepoMock.updatePost.mockResolvedValue({ id: 1, title: "Updated", pictureId: 301 });

    const result = await postService.updatePost(1, data);

    expect(uploadPictureMock).not.toHaveBeenCalled();
    expect(postRepoMock.updatePost).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, title: "Updated", pictureId: 301 });
  });

  test("updatePost throws NotFoundError if post does not exist", async () => {
    postRepoMock.getPostById.mockResolvedValue(null);

    await expect(postService.updatePost(999, { title: "x" })).rejects.toThrow(Errors.NotFoundError);
  });

  // -----------------------------
  // DELETE
  // -----------------------------
  test("deletePost removes picture and post", async () => {
    const existingPost = { id: 1, pictureId: 401, picture: { publicId: "picId" } };
    postRepoMock.getPostById.mockResolvedValue(existingPost);
    postRepoMock.deletePost.mockResolvedValue(existingPost);

    const result = await postService.deletePost(1);

    expect(cloudinaryMock.uploader.destroy).toHaveBeenCalledWith("picId");
    expect(pictureRepoMock.deletePicture).toHaveBeenCalledWith(401, {});
    expect(postRepoMock.deletePost).toHaveBeenCalledWith(1, {});
    expect(result).toEqual(existingPost);
  });

  test("deletePost throws NotFoundError if post does not exist", async () => {
    postRepoMock.getPostById.mockResolvedValue(null);

    await expect(postService.deletePost(999)).rejects.toThrow(Errors.NotFoundError);
  });
});