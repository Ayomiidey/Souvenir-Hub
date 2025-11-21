import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the active about page content
    const aboutPage = await prisma.aboutPage.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!aboutPage) {
      // Return default content if none exists
      return NextResponse.json({
        heroTitle: "Crafting Memories, One Souvenir at a Time",
        heroSubtitle: "We're not just another souvenir shop. We're memory makers, dream weavers, and passionate believers that every moment deserves to be celebrated in style.",
        heroTagline: "",
        heroBadgeText: "Since 2019",
        aboutTitle: "All About Us",
        aboutDescription: "Souvenir Hub is Nigeria's leading platform for personalized and custom souvenirs.",
        aboutFeatures: [],
        stats: [],
        storyBadgeText: "Our Journey",
        storyTitle: "From Passion to Purpose",
        storyParagraph1: "",
        storyParagraph2: "",
        storyParagraph3: "",
        valuesBadgeText: "What Drives Us",
        valuesTitle: "Our Core Values",
        valuesSubtitle: "These principles guide everything we do",
        values: [],
        ctaTitle: "Ready to Create Your Perfect Souvenir?",
        ctaSubtitle: "Join thousands of happy customers who trust us to preserve their special moments",
      });
    }

    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      { error: "Failed to fetch about page content" },
      { status: 500 }
    );
  }
}
