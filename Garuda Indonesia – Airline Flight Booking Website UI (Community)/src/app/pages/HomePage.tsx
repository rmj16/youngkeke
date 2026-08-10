"use client";

import { HeroSection } from "../components/HeroSection";
import { ServicesSection } from "../components/ServicesSection";
import { DestinationsSection } from "../components/DestinationsSection";
import { AboutSection } from "../components/AboutSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <DestinationsSection />
      <AboutSection />
    </main>
  );
}
