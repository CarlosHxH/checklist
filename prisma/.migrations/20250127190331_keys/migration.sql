/*
  Warnings:

  - Made the column `updatedAt` on table `vehiclekey` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `vehiclekey` DROP FOREIGN KEY `vehicleKey_userId_fkey`;

-- DropForeignKey
ALTER TABLE `vehiclekey` DROP FOREIGN KEY `vehicleKey_vehicleId_fkey`;

-- AlterTable
ALTER TABLE `inspection` ADD COLUMN `kilometer` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `eixo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vehiclekey` ADD COLUMN `dataAccept` DATETIME(3) NULL,
    ADD COLUMN `isAccept` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastUser` VARCHAR(191) NULL,
    ADD COLUMN `parentId` VARCHAR(191) NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `KeyLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `pickupTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnTime` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `VehicleKey_lastUser_idx` ON `VehicleKey`(`lastUser`);

-- CreateIndex
CREATE INDEX `VehicleKey_parentId_idx` ON `VehicleKey`(`parentId`);

-- CreateIndex
CREATE INDEX `VehicleKey_createdAt_idx` ON `VehicleKey`(`createdAt`);

-- AddForeignKey
ALTER TABLE `VehicleKey` ADD CONSTRAINT `VehicleKey_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleKey` ADD CONSTRAINT `VehicleKey_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KeyLog` ADD CONSTRAINT `KeyLog_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KeyLog` ADD CONSTRAINT `KeyLog_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `vehiclekey` RENAME INDEX `vehicleKey_userId_fkey` TO `VehicleKey_userId_idx`;

-- RenameIndex
ALTER TABLE `vehiclekey` RENAME INDEX `vehicleKey_vehicleId_fkey` TO `VehicleKey_vehicleId_idx`;
