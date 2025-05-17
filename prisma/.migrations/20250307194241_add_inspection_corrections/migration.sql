/*
  Warnings:

  - You are about to drop the column `fotoVeiculo` on the `inspection` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `vehiclekey` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `inspection` DROP FOREIGN KEY `Inspection_userId_fkey`;

-- DropForeignKey
ALTER TABLE `inspection` DROP FOREIGN KEY `Inspection_vehicleId_fkey`;

-- AlterTable
ALTER TABLE `inspect` ADD COLUMN `vehicleId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `inspection` DROP COLUMN `fotoVeiculo`,
    ADD COLUMN `extintor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `cidadeBase` VARCHAR(191) NULL,
    ADD COLUMN `fixo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tacografo` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `vehiclekey` MODIFY `status` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `InspectionPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `photo` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(191) NULL,

    INDEX `InspectionPhoto_inspectionId_idx`(`inspectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspectionCorrection` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `resolvidoPor` VARCHAR(191) NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InspectionCorrection_inspectionId_idx`(`inspectionId`),
    INDEX `InspectionCorrection_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fotoDocumento` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_fotoDocumento_AB_unique`(`A`, `B`),
    INDEX `_fotoDocumento_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fotoTacografo` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_fotoTacografo_AB_unique`(`A`, `B`),
    INDEX `_fotoTacografo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fotoExtintor` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_fotoExtintor_AB_unique`(`A`, `B`),
    INDEX `_fotoExtintor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fotoVeiculo` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_fotoVeiculo_AB_unique`(`A`, `B`),
    INDEX `_fotoVeiculo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InspectionPhoto` ADD CONSTRAINT `InspectionPhoto_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspect` ADD CONSTRAINT `Inspect_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectionCorrection` ADD CONSTRAINT `InspectionCorrection_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectionCorrection` ADD CONSTRAINT `InspectionCorrection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoDocumento` ADD CONSTRAINT `_fotoDocumento_A_fkey` FOREIGN KEY (`A`) REFERENCES `InspectionPhoto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoDocumento` ADD CONSTRAINT `_fotoDocumento_B_fkey` FOREIGN KEY (`B`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoTacografo` ADD CONSTRAINT `_fotoTacografo_A_fkey` FOREIGN KEY (`A`) REFERENCES `InspectionPhoto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoTacografo` ADD CONSTRAINT `_fotoTacografo_B_fkey` FOREIGN KEY (`B`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoExtintor` ADD CONSTRAINT `_fotoExtintor_A_fkey` FOREIGN KEY (`A`) REFERENCES `InspectionPhoto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoExtintor` ADD CONSTRAINT `_fotoExtintor_B_fkey` FOREIGN KEY (`B`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoVeiculo` ADD CONSTRAINT `_fotoVeiculo_A_fkey` FOREIGN KEY (`A`) REFERENCES `InspectionPhoto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fotoVeiculo` ADD CONSTRAINT `_fotoVeiculo_B_fkey` FOREIGN KEY (`B`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `inspection` RENAME INDEX `Inspection_userId_fkey` TO `inspection_userId_idx`;

-- RenameIndex
ALTER TABLE `inspection` RENAME INDEX `Inspection_vehicleId_fkey` TO `inspection_vehicleId_idx`;
