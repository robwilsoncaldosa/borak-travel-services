"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookNowButton } from "../_components/book-now-button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageForm from "../_components/landing-page-form";
import { H1 } from "@/components/ui/typography";
import PackageCardsSection from "../_components/package-cards-section";
import CebuTourismSection from "../_components/cebu-tourism-section";
import HowItWorksSection from "../_components/how-it-works-section";
import TourPackagesSection from "../_components/tour-packages-section";
import BookNowSection from "../_components/book-now-section";

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
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-extrabold capitalize tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]"
          >
            Borak van rentals
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl mt-4 capitalize font-bold tracking-widest drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]"
          >
            Packages & Extras
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl mt-6 font-bold tracking-wider max-w-2xl text-center capitalize"
          >
            Exploring Cebu is an unforgettable adventure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <BookNowButton />
          </motion.div>

          <Card className="rounded-4xl shadow-lg absolute top-[88dvh] w-full lg:w-11/12 px-4">
            <CardContent>
              <LandingPageForm />
            </CardContent>
          </Card>
        </div>{" "}
      </div>
      <section className="min-h-screen lg:p-28 p-0 space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <H1 className="text-center">
            Most Affordable & Best Selling Van rental with packages
          </H1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <PackageCardsSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <CebuTourismSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HowItWorksSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TourPackagesSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <BookNowSection />
        </motion.div>
      </section>
    </div>
  );
}