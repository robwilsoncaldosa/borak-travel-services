'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, packageApi } from '@/lib/backend_api/package';
import {
  LoadingSpinner,
  NotFoundMessage,
  PackageHeader,
  ImageGallery,
  PackageDescription,
  BookingCard,
  ReviewSection,
  getValidImageUrl
} from './components';

export default function PackageDetail() {
    const params = useParams();
    const router = useRouter();
    const [packageData, setPackageData] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                if (!params.id || typeof params.id !== 'string') {
                    throw new Error('Invalid package ID');
                }
                const data = await packageApi.getPackageById(params.id);
                setPackageData(data);
            } catch (error) {
                console.error('Error fetching package:', error);
                toast.error('Failed to load package details');
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [params.id]);

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: packageData?.title || 'Travel Package',
                text: `Check out this amazing travel package: ${packageData?.title}`,
                url: window.location.href,
            }).catch(err => console.error('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    //   useEffect(() => {
    //     // In a real app, you would fetch this data from an API
    //     const packageId = typeof params.id === 'string' ? parseInt(params.id) : Array.isArray(params.id) ? parseInt(params.id[0]) : 0;
    //     const foundPackage = packages.find(p => p.id === packageId);

    //     if (foundPackage) {
    //       setPackageData(foundPackage);
    //     }
    //     setLoading(false);
    //   }, [params.id]);

    const handleBookNow = () => {
        if (packageData) {
            // Generate a unique booking ID (in a real app, this would come from the backend)
            const bookingId = `BKG-${Date.now().toString().slice(-6)}`;

            // Navigate to confirmation page with booking details
            router.push(`/confirmation/${bookingId}?tour=${packageData.title.toLowerCase().replace(/ /g, '_')}`);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!packageData) {
        return <NotFoundMessage />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Package Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 pt-30">
                <PackageHeader 
                    packageData={packageData} 
                    isWishlisted={isWishlisted} 
                    toggleWishlist={toggleWishlist} 
                    handleShare={handleShare} 
                />

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Main content */}
                    <div className="lg:col-span-2">
                        <ImageGallery packageData={packageData} />
                        <PackageDescription packageData={packageData} />
                        <ReviewSection packageData={packageData} />
                    </div>

                    {/* Right column - Booking card */}
                    <div className="lg:col-span-1">
                        <BookingCard packageData={packageData} />
                    </div>
                </div>
            </div>
        </div>
    );
}