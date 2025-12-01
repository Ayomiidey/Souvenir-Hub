-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isClearance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCorporate" BOOLEAN NOT NULL DEFAULT false;
