"use client";

import Image from "next/image";
import { Search, Calendar, CreditCard, Navigation } from "lucide-react";

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
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-2">One Click for you</h2>
            </div>
            
            <div className="space-y-6">
              <div className="group p-6 rounded-xl border border-transparent box-border transition-all duration-300 hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-700 hover:translate-y-[-4px]">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full transition-colors duration-300 bg-transparent group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                    <Search className="h-6 w-6 text-[#2e2e2e] dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2e2e2e] dark:text-neutral-100">Find your destination</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-1">Embark on a journey to discover your dreams destination, where adventure and relaxation await.</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-xl border border-transparent box-border transition-all duration-300 hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-700 hover:translate-y-[-4px]">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full transition-colors duration-300 bg-transparent group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                    <Calendar className="h-6 w-6 text-[#2e2e2e] dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2e2e2e] dark:text-neutral-100">Book a Tour</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-1">Ensure a smooth travel experience by booking a tickets to your Preferred destination via our booking platform</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-xl border border-transparent box-border transition-all duration-300 hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-700 hover:translate-y-[-4px]">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full transition-colors duration-300 bg-transparent group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                    <CreditCard className="h-6 w-6 text-[#2e2e2e] dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2e2e2e] dark:text-neutral-100">Make Payment</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-1">We offer a variety of payment options to meet your preferences and ensure a hassle-free transactions process.</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-xl border border-transparent box-border transition-all duration-300 hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-700 hover:translate-y-[-4px]">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full transition-colors duration-300 bg-transparent group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                    <Navigation className="h-6 w-6 text-[#2e2e2e] dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2e2e2e] dark:text-neutral-100">Rent a Van and Explore destination with packages</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-1">You&apos;ll be immersed in a captivating tapestry of sights, sounds and tastes, as you wind your way though the ancient streets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}