import { 
  Heart, 
  Sparkles, 
  Users, 
  Award, 
  Target, 
  Rocket,
  Package,
  Smile,
  TrendingUp,
  Globe2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Souvenir Hub - Crafting Memories Since 2024",
  description: "Discover the story behind Souvenir Hub. Learn about our mission to create beautiful, personalized souvenirs that celebrate life's special moments.",
  keywords: "about us, souvenir hub, custom souvenirs, personalized gifts, company story",
};

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Package, label: "Products Delivered", value: "50,000+" },
    { icon: Smile, label: "Satisfaction Rate", value: "98%" },
    { icon: TrendingUp, label: "Years in Business", value: "2+" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make starts with you. Your satisfaction is our top priority, and we go the extra mile to ensure your experience is exceptional."
    },
    {
      icon: Sparkles,
      title: "Quality Craftsmanship",
      description: "We believe in creating products that last. Each souvenir is carefully crafted with premium materials and attention to detail."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly evolve to bring you the latest in customization technology and design trends, making your memories truly unique."
    },
    {
      icon: Globe2,
      title: "Sustainability",
      description: "We're committed to eco-friendly practices, from sustainable materials to responsible packaging, because we care about our planet."
    }
  ];


  return (

    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <div className="relative container max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Since 2024</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Crafting Memories,
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                One Souvenir at a Time
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              We&apos;re not just another souvenir shop. We&apos;re memory makers, dream weavers, 
              and passionate believers that every moment deserves to be celebrated in style.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#our-story" 
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl inline-block text-center"
              >
                Our Story
              </a>
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full font-semibold hover:bg-white/30 transition-all inline-block text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Souvenir Hub Section */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 mb-4">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">About Souvenir Hub</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              All About Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Souvenir Hub is Nigeria&apos;s leading platform for personalized and custom souvenirs. We help individuals, businesses, and organizations create unique, memorable keepsakes for every occasion—weddings, birthdays, corporate events, and more. Our app makes it easy to browse, customize, and order a wide range of products, from mugs and t-shirts to plaques, bags, and branded gifts. With nationwide delivery, top-notch customer service, and a commitment to quality, we turn your special moments into lasting memories. Whether you&apos;re a customer looking for the perfect gift or a business seeking branded merchandise, Souvenir Hub is your one-stop shop for creativity, convenience, and celebration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-slate-700 text-lg">
              <ul className="list-disc pl-6 space-y-2 text-left">
                <li><b>Personalized Products:</b> Easily customize souvenirs with names, photos, logos, and messages.</li>
                <li><b>Wide Selection:</b> Choose from hundreds of items for every event and budget.</li>
                <li><b>Easy Ordering:</b> Seamless online experience from design to doorstep.</li>
                <li><b>Business Solutions:</b> Bulk orders, corporate branding, and event support for organizations.</li>
                <li><b>Nationwide Delivery:</b> Fast, reliable shipping to all states in Nigeria.</li>
                <li><b>Exceptional Support:</b> Friendly, responsive customer service every step of the way.</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://plus.unsplash.com/premium_photo-1665203442280-1118daf3de38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbGl2ZXJ5JTIwbWFufGVufDB8fDB8fHww"
                alt="Souvenir Hub Business"
                width={400}
                height={400}
                className="w-full max-w-md rounded-2xl shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
                <Rocket className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Our Journey</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                From Passion to Purpose
              </h2>
              
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  It all started with a simple idea: what if every special moment could be preserved 
                  in something beautiful, tangible, and uniquely yours? In 2024, we set out to revolutionize 
                  the souvenir industry by combining traditional craftsmanship with modern customization technology.
                </p>
                <p>
                  What began as a small workshop has grown into a thriving community of memory makers. 
                  Today, we serve thousands of customers across the nation, helping them celebrate life&apos;s 
                  precious moments—from weddings and birthdays to corporate events and everything in between.
                </p>
                <p>
                  But we haven&apos;t forgotten our roots. Every product still receives the same care and attention 
                  that went into our very first custom order. Because at Souvenir Hub, you&apos;re not just a 
                  customer—you&apos;re part of our story.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <Award className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Award-Winning Quality</p>
                    <p className="text-white/80 mt-2">Trusted by thousands</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">What Drives Us</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product design to customer service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        
        <div className="relative container max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Your Perfect Souvenir?
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who trust us to preserve their special moments
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/products"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl inline-block text-center"
            >
              Shop Now
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full font-semibold hover:bg-white/30 transition-all inline-block text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
