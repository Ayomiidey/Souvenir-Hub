import { CarouselDotsProps } from "@/types/carousel";

export default function CarouselDots({
  itemCount,
  currentIndex,
  onDotClick,
}: CarouselDotsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {Array.from({ length: itemCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
            currentIndex === index ? "bg-white" : "bg-gray-400"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
