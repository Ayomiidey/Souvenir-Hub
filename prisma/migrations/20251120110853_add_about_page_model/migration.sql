-- CreateTable
CREATE TABLE "about_pages" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroTagline" TEXT NOT NULL,
    "heroBadgeText" TEXT NOT NULL DEFAULT 'Since 2019',
    "aboutTitle" TEXT NOT NULL,
    "aboutDescription" TEXT NOT NULL,
    "aboutFeatures" JSONB NOT NULL,
    "stats" JSONB NOT NULL,
    "storyBadgeText" TEXT NOT NULL,
    "storyTitle" TEXT NOT NULL,
    "storyParagraph1" TEXT NOT NULL,
    "storyParagraph2" TEXT NOT NULL,
    "storyParagraph3" TEXT NOT NULL,
    "valuesBadgeText" TEXT NOT NULL,
    "valuesTitle" TEXT NOT NULL,
    "valuesSubtitle" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaSubtitle" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_pages_pkey" PRIMARY KEY ("id")
);
