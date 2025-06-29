import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Percent } from "lucide-react";

export function DealsSection() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Special Deals</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Limited time offers on our most popular items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deal 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-8 space-y-4">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              <Percent className="h-3 w-3 mr-1" />
              25% OFF
            </Badge>
            <h3 className="text-2xl font-bold">Custom T-Shirts</h3>
            <p className="text-white/90">
              Get 25% off all custom printed t-shirts. Perfect for events,
              teams, or personal style.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Limited time offer</span>
            </div>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/categories/t-shirts-apparel">Shop T-Shirts</Link>
            </Button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"
              alt="T-shirt"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Deal 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-8 space-y-4">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              <Percent className="h-3 w-3 mr-1" />
              Buy 2 Get 1 Free
            </Badge>
            <h3 className="text-2xl font-bold">Custom Mugs</h3>
            <p className="text-white/90">
              Buy any 2 custom mugs and get the 3rd one absolutely free. Perfect
              for gifts!
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>This week only</span>
            </div>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/categories/mugs-drinkware">Shop Mugs</Link>
            </Button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop"
              alt="Mug"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
