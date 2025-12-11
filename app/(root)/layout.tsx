import { CartSidebar } from "@/components/cart/cart-sidebar";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { WishlistSidebar } from "@/components/wishlist/wishlist-sidebar";

export const metadata = {
  title: "ClassySouvenir",
  description: "Shop the best Souvenir!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden pt-[65px] sm:pt-[100px] lg:pt-[163px]">
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <WishlistSidebar />
    </div>
  );
}
