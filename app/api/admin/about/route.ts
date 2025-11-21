import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

interface AboutPageData {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline?: string;
  heroBadgeText?: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutFeatures?: Prisma.InputJsonValue;
  stats?: Prisma.InputJsonValue;
  storyBadgeText: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  valuesBadgeText: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values?: Prisma.InputJsonValue;
  ctaTitle: string;
  ctaSubtitle: string;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const aboutPage = await prisma.aboutPage.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(aboutPage || {});
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      { error: "Failed to fetch about page content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as AboutPageData;

    // Deactivate all existing about pages
    await prisma.aboutPage.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new about page
    const aboutPage = await prisma.aboutPage.create({
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroTagline: body.heroTagline || "",
        heroBadgeText: body.heroBadgeText || "Since 2019",
        aboutTitle: body.aboutTitle,
        aboutDescription: body.aboutDescription,
        aboutFeatures: (body.aboutFeatures || []) as Prisma.InputJsonValue,
        stats: (body.stats || []) as Prisma.InputJsonValue,
        storyBadgeText: body.storyBadgeText,
        storyTitle: body.storyTitle,
        storyParagraph1: body.storyParagraph1,
        storyParagraph2: body.storyParagraph2,
        storyParagraph3: body.storyParagraph3,
        valuesBadgeText: body.valuesBadgeText,
        valuesTitle: body.valuesTitle,
        valuesSubtitle: body.valuesSubtitle,
        values: (body.values || []) as Prisma.InputJsonValue,
        ctaTitle: body.ctaTitle,
        ctaSubtitle: body.ctaSubtitle,
        isActive: true,
      },
    });

    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error creating about page:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create about page content", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as AboutPageData;
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "About page ID is required" },
        { status: 400 }
      );
    }

    const aboutPage = await prisma.aboutPage.update({
      where: { id },
      data: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroTagline: body.heroTagline || "",
        heroBadgeText: body.heroBadgeText || "Since 2019",
        aboutTitle: body.aboutTitle,
        aboutDescription: body.aboutDescription,
        aboutFeatures: (body.aboutFeatures || []) as Prisma.InputJsonValue,
        stats: (body.stats || []) as Prisma.InputJsonValue,
        storyBadgeText: body.storyBadgeText,
        storyTitle: body.storyTitle,
        storyParagraph1: body.storyParagraph1,
        storyParagraph2: body.storyParagraph2,
        storyParagraph3: body.storyParagraph3,
        valuesBadgeText: body.valuesBadgeText,
        valuesTitle: body.valuesTitle,
        valuesSubtitle: body.valuesSubtitle,
        values: (body.values || []) as Prisma.InputJsonValue,
        ctaTitle: body.ctaTitle,
        ctaSubtitle: body.ctaSubtitle,
      },
    });

    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error updating about page:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update about page content", details: errorMessage },
      { status: 500 }
    );
  }
}
