"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { FirebaseConfigWarning } from "@/components/FirebaseConfigWarning";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  HeroSection,
  ClientsStrip,
  StatsSection,
  ValueSection,
  HowSection,
  DemoSection,
  GallerySection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  useScrollReveal();

  return (
    <div className="flex min-h-screen flex-col">
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <div className="pt-4 px-6 md:px-12">
          <FirebaseConfigWarning />
        </div>
        <HeroSection />
        <ClientsStrip />
        <StatsSection />
        <ValueSection />
        <HowSection />
        <DemoSection />
        <GallerySection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
