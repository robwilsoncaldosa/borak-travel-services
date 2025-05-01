import React from 'react';
import { Package } from '@/lib/backend_api/package';

export interface PackageDescriptionProps {
    packageData: Package;
}

export const PackageDescription = ({ packageData }: PackageDescriptionProps) => (
    <div className=" rounded-lg  p-6 mb-8">
        <p className="text-gray-700 mb-6">
            {packageData.about_tour}
        </p>

        {/* Package Inclusions */}
        <h2 className="text-xl font-bold mb-4">Package Inclusions:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No cancellation</span>
            </div>
            <div className="text-sm text-gray-500">After 24 hours in</div>

            <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Reserve now</span>
            </div>
            <div className="text-sm text-gray-500">Keep your travel plans flexible</div>

            <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Duration {packageData.duration_hours || 6} hours</span>
            </div>
            <div className="text-sm text-gray-500">Check availability to see starting times.</div>

            <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Live tour guide</span>
            </div>
            <div className="text-sm text-gray-500">English</div>

            <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Pick included</span>
            </div>
            <div className="text-sm text-gray-500">Accommodations</div>
        </div>

        {/* Highlights */}
        {packageData.highlights && packageData.highlights.length > 0 ? (
            <div className="text-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-2">Highlights:</h3>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                    {packageData.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                    ))}
                </ul>
            </div>
        ) : (
            <p className="text-gray-700 mb-6">
                Embark on a canyoneering adventure down the Matutinao River and jump from waterfalls. Enjoy a homemade lunch prepared by a local Filipino mom and benefit from hotel pickup and drop-off.
            </p>
        )}
    </div>
);