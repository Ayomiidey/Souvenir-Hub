-- AlterTable: Add isLowBudget column to products table
ALTER TABLE "products" ADD COLUMN "isLowBudget" BOOLEAN NOT NULL DEFAULT false;
