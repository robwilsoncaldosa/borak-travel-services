'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
        <>
            <div className="h-[600px] w-full relative">
                {/* Background Image */}
                <Image
                    src={'/Landing.jpg'}
                    alt='landing-page'
                    fill
                    className='object-cover z-0'
                    priority
                    quality={100}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />

                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full items-center justify-center text-white">
                    <h1 className="text-7xl font-extrabold tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                        Explore Packages
                    </h1>
                
                </div>
            </div>

            <div className="pt-10 flex flex-col items-center justify-center bg-white">
                <h1 className="text-4xl font-bold mb-8 text-[#2E2E2E]">We offer Van rental with Packages</h1>
            </div>

            <div className="min-h-[400px]">
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
                    <div className="flex justify-center items-center py-20">
                        <div className="text-xl text-gray-600">No packages available</div>
                    </div>
                ) : (
                    <PackageCards packages={packages} />
                )}
            </div>
        </>
    );
}
