import React from 'react';
import Link from 'next/link';
import { Package } from '@/lib/backend_api/package';

export interface BookingCardProps {
    packageData: Package;
}

export const BookingCard = ({ packageData }: BookingCardProps) => (
    <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Book this package</h2>
        
        {/* Price section */}
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">Contact for price</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Custom pricing based on group size</div>
        </div>
        
        {/* Date selection placeholder */}
        <div className="mb-6">
            <div className="border border-gray-300 rounded-md p-3 mb-3 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm font-medium">Check-in</div>
                        <div className="text-gray-700">Add date</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            
            <div className="border border-gray-300 rounded-md p-3 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm font-medium">Guests</div>
                        <div className="text-gray-700">1 guest</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
        
        {/* Booking button */}
        <Link
            href="/contact"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-blue-700 flex items-center justify-center"
        >
            Contact for Booking
        </Link>
        
        {/* No charge yet note */}
        <div className="text-center text-sm text-gray-500 mt-4">
            You won't be charged yet
        </div>
        
        {/* Package highlights */}
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Package highlights:</h3>
            <ul className="space-y-3">
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Duration: {packageData.duration_hours || 6} hours</span>
                </li>
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Live tour guide included</span>
                </li>
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Hotel pickup included</span>
                </li>
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Free cancellation available</span>
                </li>
            </ul>
        </div>
    </div>
);