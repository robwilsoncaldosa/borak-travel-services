'use client'
import Image from 'next/image';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Review data
const reviews = [
    {
        id: 1,
        name: "Maria Garcia",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        role: "Travel Enthusiast",
        rating: 5,
        review: "The van service was exceptional! Our driver was professional and knowledgeable about Cebu's attractions. The vehicle was clean and comfortable. Made our family trip memorable!",
        date: "March 15, 2024"
    },
    {
        id: 2,
        name: "John Smith",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
        role: "Business Traveler",
        rating: 5,
        review: "Perfect for our business team outing. Punctual service, excellent vehicle condition, and the driver was very accommodating with our schedule changes.",
        date: "March 10, 2024"
    },
    {
        id: 3,
        name: "Sarah Lee",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        role: "Tourist",
        rating: 5,
        review: "We booked the South Cebu package and it was amazing! The driver knew all the best spots and was very friendly. The van was spacious and comfortable for our group.",
        date: "March 5, 2024"
    },
    {
        id: 4,
        name: "David Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        role: "Family Traveler",
        rating: 5,
        review: "Outstanding service! The van was perfect for our family of 6. Very comfortable and the driver was excellent with kids. Will definitely book again!",
        date: "March 1, 2024"
    }
];

export default function Reviews() {

    return (
        <div className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 relative">
                <h2 className="text-4xl font-bold text-center mb-12 text-[#2E2E2E]">
                    Highlighted reviews from other travelers
                </h2>

                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-5/6 mx-auto"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {reviews.map((review) => (
                            <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="bg-white shadow-xl p-6 h-full transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex flex-col items-center text-center h-full justify-between">
                                        <div className="flex gap-1 mb-3">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400 text-lg" />
                                            ))}
                                        </div>
                                        
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden mb-3">
                                            <Image
                                                src={review.image || '/fallback-avatar.svg'}
                                                alt={review.name}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/fallback-avatar.svg';
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2 flex-1">
                                            <h3 className="text-base font-semibold text-[#2E2E2E] leading-snug">
                                                {review.name} - <span className="font-medium">{review.role}</span>
                                            </h3>
                                            <p className="text-xs text-gray-400">{review.date}</p>
                                            
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-grow">
                                                &ldquo;{review.review}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
                
                <div className="flex justify-center mt-6">
                    <a href="#" className="text-[#2E2E2E] hover:underline font-medium">
                        See more reviews
                    </a>
                </div>
            </div>
        </div>
    );
}
