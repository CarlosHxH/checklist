/*
  Warnings:

  - You are about to drop the column `dataAccept` on the `vehiclekey` table. All the data in the column will be lost.
  - You are about to drop the column `isAccept` on the `vehiclekey` table. All the data in the column will be lost.
  - You are about to drop the column `lastUser` on the `vehiclekey` table. All the data in the column will be lost.
  - You are about to drop the `keylog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `keylog` DROP FOREIGN KEY `KeyLog_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `keylog` DROP FOREIGN KEY `KeyLog_vehicleId_fkey`;

-- DropIndex
DROP INDEX `VehicleKey_createdAt_idx` ON `vehiclekey`;

-- DropIndex
DROP INDEX `VehicleKey_lastUser_idx` ON `vehiclekey`;

-- DropIndex
DROP INDEX `VehicleKey_parentId_idx` ON `vehiclekey`;

-- AlterTable
ALTER TABLE `vehiclekey` DROP COLUMN `dataAccept`,
    DROP COLUMN `isAccept`,
    DROP COLUMN `lastUser`,
    ADD COLUMN `status` ENUM('PENDING', 'CONFIRMED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `keylog`;

-- CreateTable
CREATE TABLE `Inspect` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startId` VARCHAR(191) NULL,
    `endId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inspect` ADD CONSTRAINT `Inspect_startId_fkey` FOREIGN KEY (`startId`) REFERENCES `inspection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspect` ADD CONSTRAINT `Inspect_endId_fkey` FOREIGN KEY (`endId`) REFERENCES `inspection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspect` ADD CONSTRAINT `Inspect_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleKey` ADD CONSTRAINT `VehicleKey_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `VehicleKey`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
