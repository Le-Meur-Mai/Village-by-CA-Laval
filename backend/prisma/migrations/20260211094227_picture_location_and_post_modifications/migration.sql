/*
  Warnings:

  - You are about to drop the `_LocationToPicture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_pictureId_fkey`;

-- DropForeignKey
ALTER TABLE `_LocationToPicture` DROP FOREIGN KEY `_LocationToPicture_A_fkey`;

-- DropForeignKey
ALTER TABLE `_LocationToPicture` DROP FOREIGN KEY `_LocationToPicture_B_fkey`;

-- AlterTable
ALTER TABLE `Picture` ADD COLUMN `locationId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `pictureId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_LocationToPicture`;

-- AddForeignKey
ALTER TABLE `Picture` ADD CONSTRAINT `Picture_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_pictureId_fkey` FOREIGN KEY (`pictureId`) REFERENCES `Picture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
