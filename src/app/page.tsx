"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FirebaseConfigWarning } from "@/components/FirebaseConfigWarning";
import {
  HeroSection,
  FeaturesSection,
  DashboardPreviewSection,
  PricingSection,
  CTASection,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-4">
          <FirebaseConfigWarning />
        </div>
        <HeroSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
