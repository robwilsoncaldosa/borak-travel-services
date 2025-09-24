'use client';

import { Package } from '@/lib/backend_api/package';
import { Suspense, useEffect, useState } from 'react';
import HeroSection from './components/hero-section';
import PackagesSection from './components/packages-section';
import { PackagesLoading } from './components/packages-section';

// Helper function to validate and format image URL
const getValidImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return '/Landing.jpg';

    try {
        new URL(imageUrl);
        return imageUrl;
    } catch {
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }
        return `/uploads/${imageUrl}`;
    }
};

// Server-side data fetching with enhanced error handling
async function getPackagesServer() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:5000';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(`${baseUrl}api/packages`, {
            signal: controller.signal,
            next: {
                revalidate: 3600, // Cache for 1 hour
                tags: ['packages']
            },
            cache: 'force-cache'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch packages`);
        }

        const data: Package[] = await response.json();

        // Transform the backend data
        return data.map((pkg: Package) => ({
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
    } catch (error) {
        console.error('Server-side fetch failed:', error);
        throw error; // Re-throw to trigger client-side fallback
    }
}

// Client-side data fetching as fallback
async function getPackagesClient() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:5000';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for client

        const response = await fetch(`${baseUrl}/api/packages`, {
            signal: controller.signal,
            cache: 'no-store' // Don't cache client-side requests
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch packages`);
        }

        const data: Package[] = await response.json();

        return data.map((pkg: Package) => ({
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
    } catch (error) {
        console.error('Client-side fetch failed:', error);
        return []; // Return empty array as final fallback
    }
}

// Client component for packages with fallback logic
function PackagesContent() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError(null);

                // Try server-side first (if SSR data is available)
                let packagesData;
                try {
                    packagesData = await getPackagesServer();
                } catch {
                    console.log('Server-side fetch failed, trying client-side...');
                    // Fallback to client-side fetching
                    packagesData = await getPackagesClient();
                }

                if (isMounted) {
                    setPackages(packagesData);
                }
            } catch (finalError) {
                console.error('All fetch attempts failed:', finalError);
                if (isMounted) {
                    setError('Failed to load packages. Please try again later.');
                    setPackages([]); // Set empty array as fallback
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPackages();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <PackagesLoading />;
    }

    if (error && packages.length === 0) {
        return (
            <div className="w-full bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                            Unable to Load Packages
                        </h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <PackagesSection packages={packages} />;
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <HeroSection />
            <Suspense fallback={<PackagesLoading />}>
                <PackagesContent />
            </Suspense>
        </div>
    );
}
