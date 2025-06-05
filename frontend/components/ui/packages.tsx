'use client';

import Image from 'next/image';
import Link from 'next/link';

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
    return (
        <div className="py-8">
            <div className="max-w-[1400px] mx-auto">              
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 px-6 md:px-12 lg:px-16 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            <div className="relative h-[250px] w-full">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={(e) => {
                                        e.currentTarget.src = '/Landing.jpg';
                                    }}
                                />
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold text-[#2E2E2E] mb-3 leading-tight tracking-tight">{pkg.title}</h2>
                                
                                <p className="text-gray-600 mb-5 line-clamp-3 text-base leading-relaxed">
                                    {pkg.description}
                                </p>
                                
                                <div className="space-y-2.5 mb-6">
                                    <h3 className="font-semibold text-[#2E2E2E] text-lg mb-2.5">Package Inclusions:</h3>
                                    {pkg.inclusions.map((inclusion, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 font-medium">{inclusion}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-200">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 font-medium">For pricing details</span>
                                        <p className="text-lg font-semibold text-[#2E2E2E]">Contact Us</p>
                                    </div>
                                    <Link href={`/packages/${pkg.id}`} className="bg-[#2E2E2E] text-white px-5 py-2.5 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-gray-700 hover:scale-105 inline-block text-sm">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}