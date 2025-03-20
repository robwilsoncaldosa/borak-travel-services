'use client'
import { useState } from 'react';
import Image from 'next/image';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

// Dummy review data
const reviews = [
    {
        id: 1,
        name: "Maria Garcia",
        image: "/reviewspp.jpg", // Add these images to your public folder
        role: "Travel Enthusiast",
        rating: 5,
        review: "The van service was exceptional! Our driver was professional and knowledgeable about Cebu's attractions. The vehicle was clean and comfortable. Made our family trip memorable!",
        date: "March 15, 2024"
    },
    {
        id: 2,
        name: "John Smith",
        image: "/reviewspp.jpg",
        role: "Business Traveler",
        rating: 5,
        review: "Perfect for our business team outing. Punctual service, excellent vehicle condition, and the driver was very accommodating with our schedule changes.",
        date: "March 10, 2024"
    },
    {
        id: 3,
        name: "Sarah Lee",
        image: "/reviewspp.jpg",
        role: "Tourist",
        rating: 5,
        review: "We booked the South Cebu package and it was amazing! The driver knew all the best spots and was very friendly. The van was spacious and comfortable for our group.",
        date: "March 5, 2024"
    },
    {
        id: 4,
        name: "David Chen",
        image: "/reviewspp.jpg",
        role: "Family Traveler",
        rating: 5,
        review: "Outstanding service! The van was perfect for our family of 6. Very comfortable and the driver was excellent with kids. Will definitely book again!",
        date: "March 1, 2024"
    }
];

export default function Reviews() {
    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 2;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const getCurrentReviews = () => {
        const start = currentPage * reviewsPerPage;
        return reviews.slice(start, start + reviewsPerPage);
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto px-4 relative">
                <h2 className="text-4xl font-bold text-center mb-12 text-[#2E2E2E]">
                    What Our Customers Say
                </h2>

                <div className="flex items-center gap-8">
                    {/* Left Arrow */}
                    <button 
                        onClick={prevPage}
                        className="hidden md:flex h-12 w-12 bg-[#2E2E2E] text-white rounded-full items-center justify-center hover:bg-gray-700 transition-colors duration-300 flex-shrink-0"
                        aria-label="Previous reviews"
                    >
                        <FaChevronLeft className="text-xl" />
                    </button>

                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {getCurrentReviews().map((review) => (
                            <div 
                                key={review.id} 
                                className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <FaQuoteLeft className="text-4xl text-[#2E2E2E]/20 mb-6" />
                                    
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-6">
                                        <Image
                                            src={review.image}
                                            alt={review.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    
                                    <p className="text-gray-600 text-lg mb-6 italic line-clamp-4">
                                        &ldquo;{review.review}&ldquo;
                                    </p>
                                    
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <FaStar key={i} className="text-yellow-400 text-xl" />
                                        ))}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-1">
                                        {review.name}
                                    </h3>
                                    <p className="text-gray-500 mb-2">{review.role}</p>
                                    <p className="text-sm text-gray-400">{review.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button 
                        onClick={nextPage}
                        className="hidden md:flex h-12 w-12 bg-[#2E2E2E] text-white rounded-full items-center justify-center hover:bg-gray-700 transition-colors duration-300 flex-shrink-0"
                        aria-label="Next reviews"
                    >
                        <FaChevronRight className="text-xl" />
                    </button>
                </div>

                {/* Mobile Navigation Buttons */}
                <div className="flex justify-center gap-4 mt-8 md:hidden">
                    <button 
                        onClick={prevPage}
                        className="h-12 w-12 bg-[#2E2E2E] text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    >
                        <FaChevronLeft className="text-xl" />
                    </button>
                    <button 
                        onClick={nextPage}
                        className="h-12 w-12 bg-[#2E2E2E] text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    >
                        <FaChevronRight className="text-xl" />
                    </button>
                </div>

                {/* Page Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {[...Array(totalPages)].map((_, index) => (
                        <div 
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentPage === index ? 'bg-[#2E2E2E] w-4' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
