import { Suspense } from "react";
import { HomePageClient } from "@/components/home/homepage-client";
import { getHomePageData } from "@/lib/services/homepage-service";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Suspense
        fallback={
          <div className="container py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-80 flex-shrink-0">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-muted rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="aspect-[16/9] bg-muted rounded-lg animate-pulse mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <HomePageClient data={data} />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "SouvenirShop - Custom Souvenirs & Personalized Gifts",
  description:
    "Discover our collection of custom souvenirs and personalized gifts. Browse by category and find the perfect item for any occasion.",
};
