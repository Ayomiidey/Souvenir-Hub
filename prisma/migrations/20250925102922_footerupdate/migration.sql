-- CreateTable
CREATE TABLE "Footer" (
    "id" SERIAL NOT NULL,
    "companyTitle" TEXT NOT NULL,
    "companyDescription" TEXT NOT NULL,
    "socialLinks" JSONB NOT NULL,
    "customerServiceTitle" TEXT NOT NULL,
    "customerServiceLinks" JSONB NOT NULL,
    "contactTitle" TEXT NOT NULL,
    "contacts" JSONB NOT NULL,
    "copyright" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);
