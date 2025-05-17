/*
  Warnings:

  - You are about to alter the column `fotoVeiculo` on the `inspection` table. The data in that column could be lost. The data in that column will be cast from `MediumBlob` to `LongText`.

*/
-- AlterTable
ALTER TABLE `inspection` MODIFY `fotoVeiculo` LONGTEXT NULL;
