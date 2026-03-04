/*
  Warnings:

  - You are about to drop the column `name` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Picture` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secureUrl` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Picture` DROP COLUMN `name`,
    DROP COLUMN `path`,
    ADD COLUMN `publicId` VARCHAR(191) NOT NULL,
    ADD COLUMN `secureUrl` VARCHAR(191) NOT NULL;
