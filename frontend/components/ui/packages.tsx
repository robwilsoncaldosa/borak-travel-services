'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// This interface matches the transformed data structure we'll use for display
export interface PackageCardProps {
    id: string;
    title: string;
    image: string;
    description: string;
    inclusions: string[];
    price: string;
}

export default function PackageCards({ packages }: { packages: PackageCardProps[] }) {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const handleImageError = (packageId: string) => {
        setImageErrors(prev => new Set(prev).add(packageId));
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <Link
                            key={pkg.id}
                            href={`/packages/${pkg.id}`}
                            className="group block cursor-pointer h-full"
                        >
                            <div className="relative h-full flex flex-col">
                                {/* Image Container - Fixed aspect ratio */}
                                <div className="relative aspect-square rounded-4xl overflow-hidden bg-gray-100 mb-3 flex-shrink-0">
                                    <Image
                                        src={imageErrors.has(pkg.id) ? '/Landing.jpg' : pkg.image}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        priority
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        onError={() => handleImageError(pkg.id)}
                                    />
                                </div>

                                {/* Content - Flexible height with consistent spacing */}
                                <div className="flex flex-col flex-grow space-y-3">
                                    {/* Location & Rating - Fixed height */}
                                    <div className="flex items-center justify-between h-5">
                                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate font-medium">Cebu, Philippines</span>
                                        </div>
                                        <div className="flex items-center space-x-1 flex-shrink-0">
                                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-900">{ }</span>
                                        </div>
                                    </div>

                                    {/* Title - Fixed height with line clamping */}
                                    <div className="h-12 flex items-start">
                                        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                                            {pkg.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}