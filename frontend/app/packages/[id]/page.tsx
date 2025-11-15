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
import Chatbots from "@/components/ui/chatbot"; // Import your chatbot

export default function PackageDetail() {
    const params = useParams();
    const [packageData, setPackageData] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8 pt-30">
                {/* Only show header if title exists */}
                {packageData.title && (
                    <PackageHeader
                        packageData={packageData}
                        isWishlisted={isWishlisted}
                        toggleWishlist={toggleWishlist}
                        handleShare={handleShare}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Only show gallery if images exist */}
                        {packageData.images && packageData.images.length > 0 && (
                            <ImageGallery packageData={packageData} />
                        )}

                        {/* Only show description if about_tour exists */}
                        {packageData.about_tour && (
                            <PackageDescription packageData={packageData} />
                        )}

                        {/* Only show reviews if there are reviews */}
                        {Array.isArray(packageData.reviews) && packageData.reviews.length > 0 && (
                            <ReviewSection packageData={packageData} />
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        {/* Only show booking card if price exists */}
                        {packageData.price && (
                            <BookingCard
                                packageData={packageData}
                                openChatbot={() => setIsChatbotOpen(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Chatbots isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        </div>
    );
}