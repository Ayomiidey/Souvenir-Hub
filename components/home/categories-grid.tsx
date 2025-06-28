import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "T-Shirts & Apparel",
    slug: "t-shirts-apparel",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    description: "Custom printed clothing for every occasion",
  },
  {
    name: "Mugs & Drinkware",
    slug: "mugs-drinkware",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
    description: "Personalized mugs and drinkware",
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Beautiful decorative items for your home",
  },
  {
    name: "Keychains",
    slug: "keychains",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    description: "Custom keychains and accessories",
  },
  {
    name: "Phone Cases",
    slug: "phone-cases",
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=300&fit=crop",
    description: "Protective cases with custom designs",
  },
  {
    name: "Stationery",
    slug: "stationery",
    image:
      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
    description: "Custom notebooks, pens, and office supplies",
  },
];

export function CategoriesGrid() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of customizable products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-muted transition-all hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={400}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-white/80 mb-3">
                {category.description}
              </p>
              <div className="flex items-center text-sm font-medium">
                <span>Shop Now</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
