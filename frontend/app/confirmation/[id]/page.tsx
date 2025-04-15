"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Clock, Users, Car, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id;
  
  const [bookingDetails, setBookingDetails] = useState({
    pickupLocation: "",
    tourLocation: "",
    passengers: 0
  });

  useEffect(() => {
    // Get booking details from URL or localStorage
    const location = searchParams.get("location") || localStorage.getItem("bookingLocation") || "";
    const tour = searchParams.get("tour") || localStorage.getItem("bookingTour") || "";
    const passengers = searchParams.get("passengers") || localStorage.getItem("bookingPassengers") || "0";
    
    // Format location and tour names for display
    const formatLocation = (loc: string) => {
      const locations: {[key: string]: string} = {
        mactan_airport: "Mactan-Cebu International Airport",
        cebu_port: "Cebu International Port",
        pier1: "Cebu Pier 1",
        pier2: "Cebu Pier 2",
        pier3: "Cebu Pier 3",
        pier4: "Cebu Pier 4",
        sm_cebu: "SM City Cebu",
        ayala_cebu: "Ayala Center Cebu",
        it_park: "Cebu IT Park"
      };
      return locations[loc] || loc;
    };
    
    const formatTour = (tour: string) => {
      const tours: {[key: string]: string} = {
        oslob: "Oslob Whale Shark Watching",
        kawasan: "Kawasan Falls",
        magellan: "Magellan's Cross",
        taoist: "Cebu Taoist Temple",
        tops: "Tops Lookout",
        temple_of_leah: "Temple of Leah",
        sirao: "Sirao Flower Garden",
        simala: "Simala Shrine",
        moalboal: "Moalboal Sardine Run",
        bantayan: "Bantayan Island",
        malapascua: "Malapascua Island",
        badian: "Badian Canyoneering"
      };
      return tours[tour] || tour;
    };
    
    setBookingDetails({
      pickupLocation: formatLocation(location),
      tourLocation: formatTour(tour),
      passengers: parseInt(passengers)
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header with logo and booking ID */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 text-center mb-2 font-medium tracking-wide">Booking ID: {bookingId}</p>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Your Activities</h1>
        
        {/* Activity locations */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 mr-3 animate-pulse"></div>
            <p className="text-base font-medium text-gray-800">{bookingDetails.pickupLocation || "Cebu City (Pickup Location)"}</p>
          </div>
          <div className="flex items-start">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-2 mr-3"></div>
            <p className="text-base font-medium text-gray-800">{bookingDetails.tourLocation || "Tour Destination"}</p>
          </div>
        </div>
        
        {/* Travel times */}
        <div className="flex justify-between mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="font-bold text-lg text-blue-600">2 mins</p>
            <p className="text-sm text-gray-600">Driver arrival</p>
          </div>
          <div className="flex items-center text-gray-400">
            <ArrowRight className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-blue-600">22 mins</p>
            <p className="text-sm text-gray-600">Travel time</p>
          </div>
        </div>
        
        {/* Package details */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="font-bold text-lg mb-1 text-gray-800">Package 1</h2>
          <p className="text-sm text-gray-600 mb-4">Micro</p>
          
          <h3 className="font-bold text-md mb-1 text-gray-700">White Grandia Van Rent</h3>
          <p className="text-sm text-gray-600 mb-4">with professional driver</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center bg-gray-50 p-2 rounded-lg">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{bookingDetails.passengers || 8} pax</span>
            </div>
            <div className="flex items-center bg-gray-50 p-2 rounded-lg">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">Hotel stay</span>
            </div>
            <div className="flex items-center bg-gray-50 p-2 rounded-lg">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">Meals included</span>
            </div>
            <div className="flex items-center bg-gray-50 p-2 rounded-lg">
              <Car className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">Tour guide</span>
            </div>
          </div>
        </div>
        
        {/* Book now button */}
        <Link href="/">
          <Button className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base">
            Confirm Booking
          </Button>
        </Link>
      </div>
    </div>
  );
}