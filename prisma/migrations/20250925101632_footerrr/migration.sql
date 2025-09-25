/*
  Warnings:

  - You are about to drop the `Footer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FooterLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FooterSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FooterLink" DROP CONSTRAINT "FooterLink_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "FooterSection" DROP CONSTRAINT "FooterSection_footerId_fkey";

-- DropTable
DROP TABLE "Footer";

-- DropTable
DROP TABLE "FooterLink";

-- DropTable
DROP TABLE "FooterSection";
