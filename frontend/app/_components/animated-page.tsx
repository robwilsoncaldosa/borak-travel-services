"use client";

import Image from "next/image";
import { BookNowButton } from "../_components/book-now-button";
import { H1 } from "@/components/ui/typography";
import PackageCardsSection from "../_components/package-cards-section";
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
      
      {/* Enhanced overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60 z-5"></div>
      
      <div className="relative z-10 flex flex-col h-full items-end justify-center pr-8 text-white">
        <div className="w-full max-w-lg backdrop-blur-2xl bg-white/15 p-8 rounded-2xl border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <AnimatedSection type="initial" direction="right">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🚐</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white font-serif" 
                    style={{ fontFamily: '"Playfair Display", serif', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                  Borak Van Rentals
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-1"></div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection type="initial" direction="right" delay={0.3}>
            <h2 className="text-xl font-semibold text-yellow-200 mb-4" 
                style={{ fontFamily: '"Poppins", sans-serif' }}>
              Packages & Extras
            </h2>
          </AnimatedSection>
          
          <AnimatedSection type="initial" delay={0.6}>
            <p className="text-2xl mb-4 text-white font-medium" 
               style={{ fontFamily: '"Dancing Script", cursive', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
              Exploring Cebu is an unforgettable adventure.
            </p>
            
            <div className="space-y-3 mb-6">
              <p className="text-base text-white/95 leading-relaxed" 
                 style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="font-semibold text-yellow-200">Discover paradise</span> with our premium van rental services tailored for your journey through Cebu's breathtaking landscapes.
              </p>
              
              <p className="text-base text-white/95 leading-relaxed" 
                 style={{ fontFamily: '"Poppins", sans-serif' }}>
                From pristine beaches and crystal-clear waters to vibrant cultural experiences — travel in comfort and style.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 mb-6">
              <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm font-medium text-white">24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm font-medium text-white">Professional Drivers</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm font-medium text-white">Custom Itineraries</span>
              </div>
            </div>
          </AnimatedSection>  
          
          <AnimatedSection type="initial" delay={1.2}>
            <div className="text-center">
              <p className="text-sm text-white/90 mb-3 font-medium" 
                 style={{ fontFamily: '"Poppins", sans-serif' }}>
                🌴 Begin your Cebu journey today 🌴
              </p>
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
      
      <section className="py-8 md:py-16 px-4 space-y-12 md:space-y-20 max-w-full">
        <AnimatedSection>
          <H1 className="text-center text-xl md:text-3xl break-words">
            Most Affordable & Best Selling Van rental with packages
          </H1>
        </AnimatedSection>
        
        <AnimatedSection>
          <PackageCardsSection />
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