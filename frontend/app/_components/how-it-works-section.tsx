"use client";

import Image from "next/image";

export default function HowItWorksSection() {
  return (
    <div className="w-full py-16 bg-white rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2">
            <Image
              src="/travel-experience.png"
              alt="Traveler enjoying scenic view"
              width={600}
              height={800}
              className="rounded-3xl object-cover min-h-[500px] w-full"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-8">
            <div>
              <p className="text-neutral-600 dark:text-neutral-300 text-lg">How it works</p>
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-2">Simple Steps to Paradise</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                Planning your perfect Cebu adventure has never been easier. Start by browsing our carefully curated collection of travel packages, each designed to showcase the best of what this beautiful island has to offer. From pristine beaches to historic landmarks, our diverse selection ensures there's something for every type of traveler.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                Once you've found your ideal getaway, booking is just a few clicks away. Our streamlined reservation system guides you through the process effortlessly, allowing you to secure your dates and customize your experience. No complicated forms or lengthy procedures – just simple, intuitive booking that gets you one step closer to your dream vacation.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                We've made payment convenient and secure with multiple options to suit your preferences. Whether you prefer GCash for quick mobile payments, traditional bank transfers, or credit card transactions, we've got you covered. All payments are processed through secure channels, giving you peace of mind as you prepare for your journey.
              </p>

              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Finally, sit back and let us handle the rest. From the moment you arrive, our reliable transportation and expert local guides ensure a hassle-free experience. Explore Cebu's hidden gems, create unforgettable memories, and discover why thousands of travelers choose us for their Philippine adventures. Your journey to paradise starts here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}