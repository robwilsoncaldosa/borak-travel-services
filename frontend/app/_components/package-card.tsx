"use client";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  backgroundImage?: string;
  title: string;
  description: string;
  hoverContent?: string;
  buttonText?: string;
  onBookNow?: () => void;
}

export default function PackageCard({
  backgroundImage = "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=1470&auto=format&fit=crop",
  title = "Cebu Island Hopping",
  description = "Experience the crystal clear waters and stunning beaches of Cebu with our exclusive island hopping tour package.",
  hoverContent = "Visit Sumilon Island, Pescador Island, and swim with whale sharks in Oslob!",
  buttonText = "Book Now",
  onBookNow = () => console.log("Book Now clicked for", title),
}: PackageCardProps) {
  return (
    <div className="max-w-lg w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-4xl shadow-xl max-w-sm mx-auto flex flex-col justify-center items-center p-4 bg-cover bg-center transition-transform duration-300 group-hover/card:scale-[1.02]"
        )}
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        
        {/* Default content - visible by default, hidden on hover */}
        <div className="text-center w-full transition-all duration-300 transform group-hover/card:opacity-0 group-hover/card:translate-y-4 px-4">
          <h1 className="font-bold text-xl md:text-3xl text-white relative z-10 drop-shadow-md">
            {title}
          </h1>
          <p className="font-normal text-sm md:text-base text-white relative z-10 my-4 max-w-xs mx-auto drop-shadow-md">
            {description}
          </p>
        </div>
        
        {/* Hover content - hidden by default, visible on hover */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 transition-all duration-300 transform opacity-0 scale-95 group-hover/card:opacity-100 group-hover/card:scale-100">
          <p className="font-normal text-sm md:text-base text-white relative z-10 mb-6 text-center max-w-xs drop-shadow-md">
            {hoverContent}
          </p>
          <button 
            onClick={onBookNow}
            className="relative z-10 bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
