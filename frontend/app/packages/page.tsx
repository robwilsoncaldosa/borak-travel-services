import { Package } from '@/lib/backend_api/package';
import { Suspense } from 'react';
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

// Server-side data fetching with enhanced caching
async function getPackages() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/packages`, {
            next: {
                revalidate: 3600, // Cache for 1 hour (3600 seconds)
                tags: ['packages'] // Tag for on-demand revalidation
            },
            cache: 'force-cache' // Force caching
        });

        if (!response.ok) {
            throw new Error('Failed to fetch packages');
        }

        const data: Package[] = await response.json();

        // Transform the backend data to match the PackageCards component format
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
        console.error('Error fetching packages:', error);
        return [];
    }
}

// Async component for packages content
async function PackagesContent() {
    const packages = await getPackages();
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
