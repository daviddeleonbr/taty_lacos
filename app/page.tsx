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
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <Header />
      <main className="grain">
        <Hero heroImage={content.hero.image} />
        <HowItWorks />
        <FeaturedProducts products={content.featuredProducts} />
        <EmotionalBanner
          bannerImage={content.banner.image}
          bannerCaption={content.banner.caption}
          founderImage={content.founder.image}
          founderQuote={content.founder.quote}
        />
        <Categories categories={content.categories} />
        <Testimonials />
        <CustomerGallery images={content.galleryImages} />
        <CustomOrdersCTA />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
