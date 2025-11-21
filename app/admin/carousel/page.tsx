import CarouselManager from "@/components/admin/carousel/carousel-manager";

export default function ManageCarousel() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Carousel Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your homepage carousel items and promotional banners
          </p>
        </div>
        <CarouselManager />
      </div>
    </main>
  );
}
