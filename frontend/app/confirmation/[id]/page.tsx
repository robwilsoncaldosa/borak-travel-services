"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Clock, Users, Car, ArrowRight, CreditCard, ChevronLeft } from "lucide-react";
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

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the payment processing
    console.log('Payment submitted', { paymentMethod, formData, bookingDetails });
    // Redirect to success page
    window.location.href = `/confirmation/success`;
  };

  return (
    <div className="min-h-screen bg-gray-50  mt-40">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="size-8 mr-3 -ms-3 text-foreground" />
            <span className="text-2xl text-foreground font-medium">Confirm and Pay</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column - Information Details & Payment Method */}
          <div className="space-y-8">
            {/* Information Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Information Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm mb-1">Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-sm mb-1">Contact Number</label>
                  <input 
                    type="text" 
                    id="contactNumber" 
                    name="contactNumber"
                    placeholder="First Last"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button 
                  className={`border rounded p-4 flex flex-col items-center justify-center ${paymentMethod === 'card' ? 'border-gray-900' : 'border-gray-300'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span className="text-sm">Card</span>
                </button>
                <button 
                  className={`border rounded p-4 flex flex-col items-center justify-center ${paymentMethod === 'paypal' ? 'border-gray-900' : 'border-gray-300'}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <span className="font-bold text-blue-600 mb-1">P</span>
                  <span className="text-sm">Paypal</span>
                </button>
                <button 
                  className={`border rounded p-4 flex flex-col items-center justify-center ${paymentMethod === 'apple' ? 'border-gray-900' : 'border-gray-300'}`}
                  onClick={() => setPaymentMethod('apple')}
                >
                  <span className="font-bold mb-1">⌘</span>
                  <span className="text-sm">Apple</span>
                </button>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-sm mb-1">Name</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      name="cardName"
                      placeholder="First Last"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm mb-1">Card number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber"
                      placeholder=""
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="expiryMonth" className="block text-sm mb-1">Expires</label>
                      <select 
                        id="expiryMonth" 
                        name="expiryMonth"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        value={formData.expiryMonth}
                        onChange={(e) => setFormData({...formData, expiryMonth: e.target.value})}
                      >
                        <option value="">Month</option>
                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="expiryYear" className="block text-sm mb-1">Year</label>
                      <select 
                        id="expiryYear" 
                        name="expiryYear"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        value={formData.expiryYear}
                        onChange={(e) => setFormData({...formData, expiryYear: e.target.value})}
                      >
                        <option value="">Year</option>
                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="cvc" className="block text-sm mb-1">CVC</label>
                      <input 
                        type="text" 
                        id="cvc" 
                        name="cvc"
                        placeholder="CVC"
                        maxLength={3}
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                onClick={handlePaymentSubmit}
                className="w-full bg-gray-900 text-white font-medium py-3 rounded mt-6 hover:bg-gray-800 transition-colors"
              >
                Payment
              </button>
            </div>
          </div>
          {/* Right Column - Your Activities */}
          <div className="bg-transparent rounded-lg p-8 border h-fit w-fit space-y-12 ms-auto">
            <h2 className="text-lg font-semibold mb-6 text-center">Your Activities</h2>
            <hr className="border-t border-gray-200 my-6" />

            
            {/* Activity locations */}
            <div className="mb-8 space-y-6">
              <div className="flex items-start mb-6">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 mr-4"></div>
                <p className="text-sm">{bookingDetails.pickupLocation || "Cebu City (Prob) Cebu City,6000,Central"}</p>
              </div>
              <div className="flex items-start">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1 mr-4"></div>
                <p className="text-sm">{bookingDetails.tourLocation || "Spoze it part, Salma road, selecta 49"}</p>
              </div>
            </div>
            
            
            {/* Travel times */}
            <div className="flex justify-between mb-8 px-4">
              <div className="space-y-2">
                <p className="font-semibold">2 mins away</p>
                <p className="text-xs text-gray-500">Micro</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">22 mins</p>
                <p className="text-xs text-gray-500">Approx travel time</p>
              </div>
            </div>
            
            <hr className="border-t border-gray-200 my-6" />
            
            {/* Package details */}
            <div className="mb-8 space-y-4 px-4">
              <h3 className="font-semibold mb-2">Package 1</h3>
              <p className="text-xs text-gray-500 mb-3">Micro</p>
              
              <h4 className="font-medium mb-2">White Grandia Van Rent</h4>
              <p className="text-xs text-gray-500 mb-6">with driver</p>
              
              <div className="flex flex-wrap gap-6 text-xs">
                <span>{bookingDetails.passengers || 8} pax</span>
                <span>With hotel stay</span>
                <span>Food</span>
                <span>Tour guide</span>
              </div>
            </div>
            
            
            {/* Book now button */}
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded">
              Book now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}