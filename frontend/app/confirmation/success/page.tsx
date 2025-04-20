"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaFacebook, FaEnvelope, FaViber } from "react-icons/fa";



export default function BookingSuccessPage() {
  // Clear booking data from localStorage after successful booking
  useEffect(() => {
    // You might want to keep this data for reference or clear it
    // Uncomment below if you want to clear the data
    // localStorage.removeItem("bookingLocation");
    // localStorage.removeItem("bookingTour");
    // localStorage.removeItem("bookingPassengers");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Green Checkmark Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Thank you for booking with us !
        </h1>

        {/* Connect With Us Section */}
        <div className="mt-10 w-52 mx-auto">
          <div className="bg-white py-6 px-4 shadow-md rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Connect With Us
            </h2>
            <div className="flex justify-center space-x-6">
              <Link href="#" className="text-[#1877F2] hover:text-[#1469C8]">
                <FaFacebook className="w-8 h-8" />
              </Link>
              <Link href="mailto:info@boraktravel.com" className="text-[#EA4335] hover:text-[#CC372A]">
                <FaEnvelope className="w-8 h-8" />
              </Link>
              <Link href="tel:+639123456789" className="text-[#7360F2] hover:text-[#604ED8]">
                <FaViber className="w-8 h-8" />
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-6">
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}