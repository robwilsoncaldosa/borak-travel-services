"use client";

import Image from "next/image";

export default function CebuTourismSection() {
  return (
    <div className="w-full py-12 pt-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-gray-600">Best location</h3>
            <h2 className="text-4xl font-bold text-gray-900">Cebu Tourism</h2>
            <p className="text-lg text-gray-700 max-w-xl mt-2">
              Extraordinary beauty, enjoy the rich culture, and experience
              the friendliness of the local people
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-3xl overflow-hidden min-h-[250px]">
              <Image
                src="/cebu-vans.png"
                alt="Cebu van rentals"
                width={600}
                height={450}
                className="w-full min-h-[250px] object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden min-h-[250px]">
              <Image
                src="/cebu-city.png"
                alt="Cebu city skyline"
                width={600}
                height={400}
                className="w-full min-h-[250px] object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden min-h-[250px]">
              <Image
                src="/cebu-beach.png"
                alt="Cebu beach"
                width={600}
                height={400}
                className="w-full min-h-[250px] object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden min-h-[250px]">
              <Image
                src="/cebu-aerial.png"
                alt="Cebu aerial view"
                width={600}
                height={400}
                className="w-full min-h-[250px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}