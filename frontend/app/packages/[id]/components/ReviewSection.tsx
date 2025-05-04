import React from 'react';
import Image from 'next/image';
import { Package } from '@/lib/backend_api/package';

export interface ReviewSectionProps {
    packageData: Package;
}

interface Review {
    id: string;
    userName: string;
    userImage: string;
    rating: number;
    date: string;
    country: string;
    text: string;
}

// Dummy reviews data for now
const dummyReviews: Review[] = [
    {
        id: '1',
        userName: 'Matthew',
        userImage: '/avatar-1.jpg',
        rating: 5,
        date: 'April 2023',
        country: 'United Kingdom',
        text: 'Amazing experience! The canyoneering adventure down the Matutinao River was incredible. Our guide was knowledgeable and made sure we were safe throughout the journey. The lunch provided was delicious too!'
    },
    {
        id: '2',
        userName: 'Stephanie',
        userImage: '/avatar-2.jpg',
        rating: 5,
        date: 'April 2023',
        country: 'United Kingdom',
        text: 'One of the best experiences of our trip! The waterfalls were breathtaking and jumping into the crystal clear water was exhilarating. Highly recommend this tour for adventure seekers.'
    },
    {
        id: '3',
        userName: 'Richard',
        userImage: '/avatar-3.jpg',
        rating: 5,
        date: 'April 2023',
        country: 'United Kingdom',
        text: 'Fantastic day out! The canyoneering was so much fun and the scenery was stunning. Our guide was friendly and professional. The transport was comfortable and on time.'
    },
    {
        id: '4',
        userName: 'Barbara',
        userImage: '/avatar-4.jpg',
        rating: 5,
        date: 'April 2023',
        country: 'United Kingdom',
        text: 'Great adventure for the whole family! My teenagers loved the cliff jumping and swimming through the canyons. The Filipino lunch was a nice authentic touch to end the day.'
    }
];

export const ReviewSection = ({ packageData }: ReviewSectionProps) => {
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

    return (
        <div className=" rounded-lg  p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Highlighted reviews from other travelers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dummyReviews.map((review) => (
                    <div key={review.id} className="border bg-background rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                                {/* Fallback avatar if image is not available */}
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-lg">{review.userName.charAt(0)}</span>
                                </div>
                            </div>
                            <div>
                                <div className="font-medium">{review.userName}</div>
                                <div className="text-sm text-gray-500">{review.country} · {review.date}</div>
                            </div>
                        </div>
                        
                        <div className="mb-2">
                            {renderStars(review.rating)}
                        </div>
                        
                        <p className="text-gray-700 text-sm">{review.text}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                    See more reviews
                </button>
            </div>
        </div>
    );
};