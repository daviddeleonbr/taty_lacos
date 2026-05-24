import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturedProducts } from "@/components/home/featured-products";
import { EmotionalBanner } from "@/components/home/emotional-banner";
import { Categories } from "@/components/home/categories";
import { Testimonials } from "@/components/home/testimonials";
import { CustomerGallery } from "@/components/home/customer-gallery";
import { CustomOrdersCTA } from "@/components/home/custom-orders";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="grain">
        <Hero />
        <HowItWorks />
        <FeaturedProducts />
        <EmotionalBanner />
        <Categories />
        <Testimonials />
        <CustomerGallery />
        <CustomOrdersCTA />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
