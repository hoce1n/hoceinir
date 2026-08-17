/*
  Warnings:

  - Added the required column `footerStatus` to the `SiteSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "footerStatus" TEXT NOT NULL;
