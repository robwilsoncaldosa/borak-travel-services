"use client";

import Image from "next/image";
import { BookNowButton } from "../_components/book-now-button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageForm from "./landing-page-form";
import { H1 } from "@/components/ui/typography";
import PackageCardsSection from "../_components/package-cards-section";
import CebuTourismSection from "../_components/cebu-tourism-section";
import HowItWorksSection from "../_components/how-it-works-section";
import TourPackagesSection from "../_components/tour-packages-section";
import BookNowSection from "../_components/book-now-section";
import AnimatedSection from "./animated-section";

export default function AnimatedPage() {
  return (
    <div className="">
      <div className="relative h-screen w-full">
        <Image
          src={"/landing-page.png"}
          alt="landing-page"
          fill
          className="object-cover z-0"
          priority
          quality={100}
        />
        <div className="relative z-10 uppercase flex flex-col h-full items-center justify-center text-white">
          <AnimatedSection type="initial" direction="down">
            <h1 className="text-4xl md:text-7xl font-extrabold capitalize tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">Borak van rentals</h1>
          </AnimatedSection>
          
          <AnimatedSection type="initial" direction="down" delay={0.3}>
            <h2 className="text-3xl md:text-7xl mt-4 capitalize font-bold tracking-widest drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">Packages & Extras</h2>
          </AnimatedSection>
          
          <AnimatedSection type="initial" delay={0.6}>
            <p className="text-lg md:text-2xl mt-6 font-bold tracking-wider max-w-2xl text-center capitalize px-4 md:px-0">Exploring Cebu is an unforgettable adventure.</p>
          </AnimatedSection>
          
          <AnimatedSection type="initial" delay={0.9}>
            <BookNowButton />
          </AnimatedSection>

          <Card className="rounded-4xl shadow-lg absolute top-[88dvh] w-full lg:w-11/12 px-2 md:px-4 mx-auto">
            <CardContent>
              <LandingPageForm />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="min-h-screen lg:p-28 p-4 space-y-12 md:space-y-20">
        <AnimatedSection>
          <H1 className="text-center">
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
    </div>
  );
}