import { CarouselSlideProps } from "@/types/carousel";
import Image from "next/image";
import Link from "next/link";

export default function CarouselSlide({ item, isActive }: CarouselSlideProps) {
  return (
    <div className="w-full flex-shrink-0">
      <div className="relative h-[300px] sm:h-[400px] md:h-[550px]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          priority={isActive}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {item.title}
          </h2>
          <p className="text-sm md:text-base line-clamp-2">
            {item.description}
          </p>
          {item.link && (
            <Link
              href={item.link}
              className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
