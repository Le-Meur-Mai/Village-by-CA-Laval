/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Picture` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `StartUp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `defaultLogoId` VARCHAR(191) NOT NULL,
    `defaultDescriptionPictureId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Partner_name_key` ON `Partner`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Picture_publicId_key` ON `Picture`(`publicId`);

-- CreateIndex
CREATE UNIQUE INDEX `Post_title_key` ON `Post`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Quote_description_key` ON `Quote`(`description`);

-- CreateIndex
CREATE UNIQUE INDEX `StartUp_name_key` ON `StartUp`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Type_name_key` ON `Type`(`name`);
