export interface CarouselItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  type: "homepage" | "product" | "category";
  sortOrder: number;
}

export interface CarouselSlideProps {
  item: CarouselItem;
  isActive: boolean;
}

export interface CarouselArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export interface CarouselDotsProps {
  itemCount: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export interface FormData {
  title: string;
  imageUrl: string;
  link?: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  type: "homepage" | "product" | "category";
  sortOrder: number;
}
