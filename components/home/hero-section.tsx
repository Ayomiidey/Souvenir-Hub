import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                Trusted by 10,000+ customers
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Custom Souvenirs
              <span className="block text-primary">Made Perfect</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Create personalized memories with our premium quality custom
              souvenirs. From t-shirts to mugs, we bring your ideas to life with
              professional printing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8"
                asChild
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Free Shipping $50+</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Custom Printing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop"
                alt="Custom souvenirs showcase"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 z-0 h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
