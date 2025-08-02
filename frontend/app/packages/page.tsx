'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import PackageCards, { PackageCardProps } from '@/components/ui/packages';
import { Package, packageApi } from '@/lib/backend_api/package';
import AnimatedSection from '../_components/animated-section';

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

    // Smooth scroll function
    const scrollToPackages = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const packagesSection = document.getElementById('packages');
        if (packagesSection) {
            packagesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

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
            {/* Hero Section - Full Screen with Enhanced Aesthetics */}
            <section className="relative h-[100dvh] w-full">
                <Image
                    src={'/package-landing-page.jpg'}
                    alt='Explore Packages'
                    fill
                    className='object-cover object-center'
                    priority
                    quality={100}
                />
                {/* Enhanced Overlay with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 z-10" />

                {/* Centered Content with Animations */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6">
                    <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
                        <AnimatedSection type="initial" direction="up">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 sm:mb-6"
                                style={{
                                    fontFamily: '"Playfair Display", serif',
                                    textShadow: '3px 3px 12px rgba(0,0,0,0.8)',
                                    letterSpacing: '0.02em'
                                }}>
                                Discover Paradise
                            </h1>
                        </AnimatedSection>

                        <AnimatedSection type="initial" direction="up" delay={0.3}>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/95 mb-6"
                                style={{
                                    fontFamily: '"Poppins", sans-serif',
                                    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                                    fontWeight: '600'
                                }}>
                                Handpicked Premium Cebu Experiences
                            </h2>
                        </AnimatedSection>

                        <AnimatedSection type="initial" direction="up" delay={0.6}>
                            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
                                style={{
                                    fontFamily: '"Poppins", sans-serif',
                                    textShadow: '1px 1px 6px rgba(0,0,0,0.6)',
                                    fontWeight: '400'
                                }}>
                                We believe in quality over quantity. Each adventure is carefully curated and personally tested
                                to ensure you experience only the finest that Cebu has to offer.
                            </p>
                        </AnimatedSection>

                        <AnimatedSection type="initial" direction="up" delay={0.9}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a
                                    onClick={scrollToPackages}
                                    className="bg-white text-[#2E2E2E] px-10 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-2xl cursor-pointer"
                                    style={{ fontFamily: '"Poppins", sans-serif' }}
                                >
                                    Explore Premium Packages
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <AnimatedSection type="initial" direction="up" delay={1.2}>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="animate-bounce">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* Section Header with Enhanced Typography */}
            <AnimatedSection>
                <div className="w-full py-16 bg-white" id="packages">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-6">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className="text-blue-800 font-semibold text-sm">Curated Excellence</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#2E2E2E]"
                                style={{
                                    fontFamily: '"Playfair Display", serif',
                                    letterSpacing: '0.02em'
                                }}>
                                Premium Cebu Experiences
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4"
                                style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Every package below has been personally tested and handpicked by our travel experts.
                                We focus on delivering exceptional quality rather than overwhelming you with endless options.
                            </p>
                            <p className="text-base text-gray-500 max-w-2xl mx-auto"
                                style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Quality over quantity • Personally tested • Premium experiences only
                            </p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Packages Section with Enhanced Premium Layout */}
            <AnimatedSection>
                <div className="w-full bg-white">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="text-center">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-gray-200 border-t-[#2E2E2E] rounded-full animate-spin mx-auto mb-6" />
                                </div>
                                <h3 className="text-xl text-[#2E2E2E] font-semibold mb-2"
                                    style={{ fontFamily: '"Poppins", sans-serif' }}>
                                    Curating premium experiences...
                                </h3>
                                <p className="text-gray-600">
                                    We're preparing our handpicked collection for you
                                </p>
                            </div>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="flex flex-col justify-center items-center py-32">
                            <div className="text-center max-w-lg">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4"
                                    style={{ fontFamily: '"Playfair Display", serif' }}>
                                    Premium Experiences Coming Soon
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed"
                                    style={{ fontFamily: '"Poppins", sans-serif' }}>
                                    Our travel experts are currently curating exceptional experiences.
                                    Check back soon for our handpicked premium packages!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <PackageCards packages={packages} />
                    )}
                </div>
            </AnimatedSection>
        </div>
    );
}
