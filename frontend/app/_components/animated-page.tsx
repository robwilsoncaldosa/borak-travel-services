"use client";

import Image from "next/image";
import { BookNowButton } from "../_components/book-now-button";
import { H1 } from "@/components/ui/typography";
import CebuTourismSection from "../_components/cebu-tourism-section";
import HowItWorksSection from "../_components/how-it-works-section";
import TourPackagesSection from "../_components/tour-packages-section";
import BookNowSection from "../_components/book-now-section";
import AnimatedSection from "./animated-section";

export function ResponsiveLandingSection() {
  return (
    <section className="relative h-[100dvh] w-full">
      <Image
        src={"/landing-page.jpg"}
        alt="landing-page"
        fill
        className="object-cover object-center"
        priority
        quality={100}
      />

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10 z-5"></div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center  px-4 sm:px-6 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <AnimatedSection type="initial" direction="up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6"
              style={{ fontFamily: '"Playfair Display", serif', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              Best Cebu Tour Package
            </h1>
          </AnimatedSection>

          <AnimatedSection type="initial" direction="up" delay={0.3}>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: '"Poppins", sans-serif', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
              Cebu Tour Package That Is Customized For You
            </p>
          </AnimatedSection>

          <AnimatedSection type="initial" direction="up" delay={0.6}>
            <div className="flex justify-center">
              <BookNowButton />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

export default function AnimatedPage() {
  return (
    <main className="w-full overflow-x-hidden sm:w-full">
      <ResponsiveLandingSection />

      <section className="py-8 md:py-16 space-y-12 md:space-y-20 max-w-full">
        <AnimatedSection>
          <H1 className="text-center text-xl md:text-3xl break-words">
            Experience Cebu in Style: Premium Tours at Unbeatable Prices
          </H1>
        </AnimatedSection>

        <AnimatedSection>
          <CebuTourismSection />
        </AnimatedSection>

        <AnimatedSection>
          <HowItWorksSection />
        </AnimatedSection>

        <AnimatedSection>
          <TourPackagesSection />
        </AnimatedSection>

        <AnimatedSection>
          <BookNowSection />
        </AnimatedSection>
      </section>
    </main>
  );
}