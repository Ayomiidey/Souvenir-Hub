import { Truck, Shield, Palette, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Free shipping on orders over $50. Fast and reliable delivery worldwide.",
  },
  {
    icon: Palette,
    title: "Custom Printing",
    description:
      "High-quality custom printing with your designs, photos, or text.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description:
      "100% satisfaction guarantee. If you're not happy, we'll make it right.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our friendly customer support team is here to help you anytime.",
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Why Choose Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We&apos;re committed to providing the best custom souvenir experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <feature.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
