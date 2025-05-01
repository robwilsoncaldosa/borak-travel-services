import React from 'react';
import { Package } from '@/lib/backend_api/package';

export interface PackageHeaderProps {
    packageData: Package;
    isWishlisted: boolean;
    toggleWishlist: () => void;
    handleShare: () => void;
}

export const PackageHeader = ({ packageData, isWishlisted, toggleWishlist, handleShare }: PackageHeaderProps) => (
    <>
        {/* Location and Title */}
        <div className="mb-6">
            <div className="flex items-center text-red-600 mb-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{packageData.location}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{packageData.title}</h1>
        </div>

        {/* Ratings */}
        <div className="flex items-center mb-6">
            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded mr-3">Top rated</span>
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-gray-700 font-medium">4.9</span>
                <span className="ml-2 text-gray-500">208 reviews</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
                <button 
                    onClick={toggleWishlist}
                    className="flex items-center text-gray-700 hover:text-red-600"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <svg className={`w-5 h-5 ${isWishlisted ? 'text-red-600 fill-current' : 'text-gray-400'}`} 
                        stroke="currentColor" 
                        fill={isWishlisted ? "currentColor" : "none"} 
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="ml-1">Add to wishlist</span>
                </button>
                <button 
                    onClick={handleShare}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                    aria-label="Share"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
            </div>
        </div>
    </>
);