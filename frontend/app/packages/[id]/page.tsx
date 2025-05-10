'use client';

import { useParams } from 'next/navigation';
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
} from './components';

export default function PackageDetail() {
    const params = useParams();
    const [packageData, setPackageData] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
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