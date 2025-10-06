/*
  Warnings:

  - You are about to drop the `contact_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "faq_items" DROP CONSTRAINT "faq_items_faqId_fkey";

-- DropTable
DROP TABLE "contact_info";

-- DropTable
DROP TABLE "faq";

-- DropTable
DROP TABLE "faq_items";
