"use client";

import Image from "next/image";

export default function TourPackagesSection() {
  return (
    <div className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-neutral-600 dark:text-neutral-300 text-lg">Tour packages</p>
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-2">Our tourist destination with our vans</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-4 max-w-2xl">
              Our touriest destinations offer an unrivaled blend of natural beauty and cultural richness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="rounded-3xl overflow-hidden  hover:shadow-xl transition-shadow duration-300 h-[630px]">
              <div className="relative w-full h-full">
                <Image
                  src="/tour-package-1.png"
                  alt="International travel package"
                  fill
                  className="object-contain md:object-cover w-full"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
            
            <div className="rounded-3xl overflow-hidden  hover:shadow-xl transition-shadow duration-300 h-[630px]">
              <div className="relative w-full h-full">
                <Image
                  src="/tour-package-2.png"
                  alt="Waterfall tour package"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="rounded-3xl overflow-hidden  hover:shadow-xl transition-shadow duration-300 h-[630px]">
              <div className="relative w-full h-full">
                <Image
                  src="/tour-package-3.png"
                  alt="Adventure tour package"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}