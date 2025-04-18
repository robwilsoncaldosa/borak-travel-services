'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Share2, Heart, CheckCircle2, Star } from 'lucide-react';
import Reviews from '@/components/ui/reviews';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

// This would typically come from an API or database
const packages = [
  {
    id: 1,
    title: "Cebu Moalboal: Kawasan Canyoneering Adventure",
    image: "/contactbg.jpg",
    description: "Experience an adrenaline-pumping adventure through the stunning canyons of Kawasan Falls. Jump from waterfalls, swim in crystal-clear waters, and trek through scenic routes. Perfect for thrill-seekers and nature lovers.",
    longDescription: "Embark on an unforgettable canyoneering adventure in the heart of Cebu's natural wonders. Your journey begins with a scenic drive to Badian, where you'll gear up for an exciting trek through the stunning canyons of Kawasan Falls. Led by experienced guides, you'll navigate through crystal-clear waters, jump from various heights of waterfalls (ranging from 3 to 30 feet), and swim in natural pools. The adventure includes cliff jumping, swimming, and trekking through the beautiful limestone formations. After the thrilling canyoneering experience, enjoy a delicious lunch prepared by a local Filipino family. The tour ends with a relaxing visit to the main Kawasan Falls, where you can take photos and swim in its turquoise waters.",
    inclusions: [
      "10 Hours Duration",
      "Fuel & Toll Fees",
      "Pickup & Drop-off Service",
      "Professional Driver",
      "Bottled Water",
      "Travel Insurance"
    ],
    highlights: [
      "Visit to Magellan's Cross and Basilica del Santo Niño",
      "Explore the Temple of Leah and Taoist Temple",
      "Panoramic city views from Tops Lookout",
      "Shopping for local handicrafts and delicacies"
    ],
    itinerary: [
      { time: "08:00 AM", activity: "Hotel pickup" },
      { time: "09:00 AM", activity: "Magellan's Cross and Basilica del Santo Niño" },
      { time: "10:30 AM", activity: "Cebu Heritage Monument" },
      { time: "12:00 PM", activity: "Lunch at local restaurant" },
      { time: "01:30 PM", activity: "Temple of Leah" },
      { time: "03:00 PM", activity: "Taoist Temple" },
      { time: "04:30 PM", activity: "Tops Lookout" },
      { time: "06:00 PM", activity: "Return to hotel" }
    ],
    price: "₱4,500",
    duration: "10 Hours",
    maxGuests: 10,
    location: "Cebu City",
    rating: 4.5,
    reviews: 24
  },
];

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const packageId = typeof params.id === 'string' ? parseInt(params.id) : Array.isArray(params.id) ? parseInt(params.id[0]) : 0;
    const foundPackage = packages.find(p => p.id === packageId);

    if (foundPackage) {
      setPackageData(foundPackage);
    }
    setLoading(false);
  }, [params.id]);

  const handleBookNow = () => {
    if (packageData) {
      // Generate a unique booking ID (in a real app, this would come from the backend)
      const bookingId = `BKG-${Date.now().toString().slice(-6)}`;

      // Navigate to confirmation page with booking details
      router.push(`/confirmation/${bookingId}?tour=${packageData.title.toLowerCase().replace(/ /g, '_')}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Package not found</h1>
        <Link href="/packages" className="text-blue-600 hover:underline">Return to packages</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      {/* Location and Title Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="text-orange-500 h-5 w-5" />
          <span>{packageData.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{packageData.title}</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              <Share2 className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              <Heart className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md">Top rated</div>
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const starValue = packageData.rating - index;
                let fillPercentage = 0;

                if (starValue >= 1) {
                  fillPercentage = 100;
                } else if (starValue > 0) {
                  // Convert decimal to percentage and adjust fill threshold
                  const percentage = starValue * 100;
                  fillPercentage = percentage >= 75 ? 65 : percentage;
                }

                return (
                  <svg
                    key={index}
                    className="size-6"
                    viewBox="0 0 24 24"
                  >
                    <defs>
                      <linearGradient id={`star-gradient-${index}`}>
                        <stop offset={`${fillPercentage}%`} stopColor="#EAB308" />
                        <stop offset={`${fillPercentage}%`} stopColor="#D1D5DB" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#star-gradient-${index})`}
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                );
              })}
              <span className="ml-1 font-medium">{packageData.rating}</span>
            </div>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500 underline">{packageData.reviews} reviews</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="md:col-span-2 lg:col-span-2 row-span-2 relative h-[400px] rounded-l-lg overflow-hidden">
            <Image
              src={`https://images.unsplash.com/photo-1586263426392-3b3e0748f618?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt={packageData.title}
              fill
              className="object-cover"
              priority
              onError={(e: any) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="relative h-[196px] rounded-tr-lg overflow-hidden">
            <Image
              src={`https://images.unsplash.com/photo-1549848314-6feb163cb2d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt="Activity 1"
              fill
              className="object-cover"
              onError={(e: any) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="relative h-[196px] rounded-br-lg overflow-hidden">
            <Image
              src={`https://images.unsplash.com/photo-1581999016177-54acaa3c804b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt="Activity 2"
              fill
              className="object-cover"
              onError={(e: any) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-gray-700 leading-relaxed">{packageData.longDescription}</p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {packageData.itinerary.map((item: { time: string, activity: string }, index: number) => (
                  <div key={index} className="flex border-l-2 border-gray-200 pl-4 pb-2">
                    <div className="w-24 font-medium text-gray-600">{item.time}</div>
                    <div className="flex-1">{item.activity}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <Reviews />

            {/* Map Section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="w-full h-[400px] rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.8876666662584!2d123.40729571479258!3d9.936999992878565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ab6f2c5e09b36d%3A0x5a9f2c1876bdf33e!2sKawasan%20Falls!5e0!3m2!1sen!2sph!4v1710835200000!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            </section>

            {/* Important Information Section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Important Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 mb-2">Safety Requirements</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Must wear provided safety gear at all times</li>
                      <li>Follow guide instructions strictly</li>
                      <li>Stay with the group throughout the activity</li>
                      <li>No alcohol before or during the activity</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-700 mb-2">What to Bring</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Comfortable swimwear</li>
                      <li>Quick-dry clothes</li>
                      <li>Water shoes or sandals with straps</li>
                      <li>Waterproof camera (optional)</li>
                      <li>Change of clothes</li>
                      <li>Small waterproof bag for valuables</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-700 mb-2">Physical Requirements</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Good physical fitness level required</li>
                      <li>Able to swim in deep water</li>
                      <li>No heart conditions or serious medical issues</li>
                      <li>Not recommended for pregnant women</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-700 mb-2">Additional Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Age restriction: 12-55 years old</li>
                      <li>Activity may be cancelled during heavy rain</li>
                      <li>Best visited during dry season (December-May)</li>
                      <li>Early morning start recommended</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-28">
              <div className="mb-6">
                <span className="text-sm text-gray-500">Price</span>
                <p className="text-3xl font-bold text-[#2E2E2E]">Contact for Price</p>
                <span className="text-sm text-gray-500">Negotiable rates available</span>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Package Inclusions:</h3>
                {packageData.inclusions.map((inclusion: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{inclusion}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Select Date</p>
                    <p className="font-medium">Available daily</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="text-gray-500 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">Up to {packageData.maxGuests} people</p>
                  </div>
                </div>
              </div>

              <Link href="/contact" className="w-full bg-[#2E2E2E] text-white py-3 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-gray-700 hover:scale-105 text-center block mb-3">
                Contact for Pricing
              </Link>
              <button
                onClick={handleBookNow}
                className="w-full border-2 border-[#2E2E2E] text-[#2E2E2E] py-3 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-gray-100 hover:scale-105 text-center"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}