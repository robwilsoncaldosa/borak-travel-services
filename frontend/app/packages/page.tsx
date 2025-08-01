'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PackageCards, { PackageCardProps } from '@/components/ui/packages';
import { Package, packageApi } from '@/lib/backend_api/package';

// Helper function to validate and format image URL
const getValidImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return '/Landing.jpg';

    // If it's already a valid URL, return it
    try {
        new URL(imageUrl);
        return imageUrl;
    } catch {
        // If it's a relative path starting with '/', return as is
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }
        // If it's just a filename, add leading slash
        return `/uploads/${imageUrl}`;
    }
};

export default function Page() {
    const [packages, setPackages] = useState<PackageCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await packageApi.getAllPackages();
                // Transform the backend data to match the PackageCards component format
                const transformedData = data.map((pkg: Package) => ({
                    id: pkg._id,
                    title: pkg.title,
                    image: getValidImageUrl(pkg.images[0]),
                    description: pkg.about_tour,
                    inclusions: [
                        `${pkg.duration_hours} Hours Duration`,
                        ...pkg.inclusions.slice(0, 2)
                    ],
                    price: "Contact for Price"
                }));
                setPackages(transformedData);
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPackages();
    }, []);

    return (
        <div className="flex flex-col items-center">
            {/* Hero Section - Consistent with contact page */}
            <div className="h-[600px] w-full relative">
                <Image
                    src={'/Landing.jpg'}
                    alt='Explore Packages'
                    fill
                    className='object-cover'
                    priority
                    quality={100}
                />
                {/* Overlay - Consistent with other pages */}
                <div className="absolute inset-0 bg-black/50 z-10" />
                
                {/* Content - Consistent styling with contact page */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full">
                    <div className="text-center max-w-[1100px] mx-auto px-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] mb-4">
                            Explore Packages
                        </h1>
                        <p className="text-lg sm:text-xl font-medium tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] max-w-3xl mx-auto">
                            Discover our carefully curated van rental packages designed to give you the best Cebu experience. From scenic tours to cultural adventures, find the perfect journey for you.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section Header - Consistent with other sections */}
            <div className="w-full py-16 bg-transparent">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#2E2E2E]">
                        Van Rental with Premium Packages
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Choose from our selection of tour packages, each designed to showcase the beauty and culture of Cebu with comfortable transportation and expert guidance.
                    </p>
                </div>
            </div>

            {/* Packages Section */}
            <div className="w-full bg-white min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-pulse flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#2E2E2E] rounded-full animate-spin" />
                            <div className="text-xl text-gray-600 font-medium">
                                Loading amazing packages for you...
                            </div>
                        </div>
                    </div>
                ) : packages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No packages available</h3>
                            <p className="text-gray-500">Check back soon for exciting new tour packages!</p>
                        </div>
                    </div>
                ) : (
                    <PackageCards packages={packages} />
                )}
            </div>

            {/* Call to Action Section - Consistent with other pages */}
            <div className="w-full py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-bold text-[#2E2E2E] mb-4">
                            Ready to Start Your Adventure?
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Can&apos;t find the perfect package? Contact us to create a custom itinerary tailored to your preferences and budget.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/contact" 
                                className="bg-[#2E2E2E] text-white px-8 py-3 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:bg-gray-700 hover:scale-105 inline-block"
                            >
                                Contact Us
                            </Link>
                            <Link 
                                href="/" 
                                className="border-2 border-[#2E2E2E] text-[#2E2E2E] px-8 py-3 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:bg-[#2E2E2E] hover:text-white hover:scale-105 inline-block"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
