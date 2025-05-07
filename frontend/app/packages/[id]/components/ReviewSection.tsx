import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Package } from '@/lib/backend_api/package';
import { reviewApi } from '@/lib/backend_api/review';
import { Review } from '@/app/admin/dashboard/types/review.types';

export interface ReviewSectionProps {
    packageData: Package;
}

export const ReviewSection = ({ packageData }: ReviewSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const packageReviews = await reviewApi.getPackageReviews(packageData._id);
                // Filter only accepted reviews
                const acceptedReviews = packageReviews.filter(review => review.status === 'accepted');
                setReviews(acceptedReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [packageData._id]);

    // Render star rating
    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Loading reviews...</h2>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">No reviews yet</h2>
                {/* <p className="text-gray-600">Be the first to review this package!</p> */}
            </div>
        );
    }

    return (
        <div className="rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Highlighted reviews from other travelers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review._id} className="border bg-background rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                                {/* Fallback avatar if image is not available */}
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-lg">{review.guest_id.charAt(0)}</span>
                                </div>
                            </div>
                            <div>
                                <div className="font-medium">{review.guest_id}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-2">
                            {renderStars(review.rating)}
                        </div>
                        
                        <p className="text-gray-700 text-sm">{review.review}</p>
                    </div>
                ))}
            </div>
            
            {reviews.length > 4 && (
                <div className="mt-6 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                        See more reviews
                    </button>
                </div>
            )}
        </div>
    );
};