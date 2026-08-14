"use client";

import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { DestinationsSection } from "./DestinationsSection";
import { AboutSection } from "./AboutSection";

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
