"use client";

import Image from "next/image";
import { useState } from "react";
import { X, MapPin, Clock, Users } from "lucide-react";

// Tourism location data
const tourismData = [
  {
    id: 1,
    title: "Cebu City Tour",
    description: "Explore the vibrant heart of Cebu with our comprehensive city tour. Visit historical landmarks, cultural sites, and experience the bustling urban life of the Queen City of the South.",
    image: "/Borak Pictures & Logo/CebuCityTour.png",
    duration: "8 hours",
    groupSize: "2-15 people",
    highlights: ["Magellan's Cross", "Basilica del Santo Niño", "Colon Street", "Heritage Monument"]
  },
  {
    id: 2,
    title: "Cebu City Skyline",
    description: "Marvel at the stunning skyline of Cebu City from the best vantage points. Capture breathtaking views and witness the modern development of this progressive city.",
    image: "/Borak Pictures & Logo/CebuCityTour2.png",
    duration: "4 hours",
    groupSize: "2-20 people",
    highlights: ["Temple of Leah", "Sirao Flower Garden", "La Vie Parisienne", "Tops Lookout"]
  },
  {
    id: 3,
    title: "Travel Far Adventures",
    description: "Embark on exciting adventures beyond the city limits. Discover hidden gems, pristine beaches, and unforgettable experiences that Cebu has to offer.",
    image: "/Borak Pictures & Logo/BookNowTraveFar.png",
    duration: "Full day",
    groupSize: "2-12 people",
    highlights: ["Island hopping", "Snorkeling", "Beach activities", "Local cuisine"]
  },
  {
    id: 4,
    title: "Kawasan Falls",
    description: "Experience the breathtaking beauty of Kawasan Falls, one of Cebu's most famous natural attractions. Enjoy canyoneering, swimming, and the refreshing turquoise waters.",
    image: "/Borak Pictures & Logo/KawasanFalls.png",
    duration: "10 hours",
    groupSize: "2-10 people",
    highlights: ["Canyoneering", "Waterfall swimming", "Bamboo rafting", "Nature photography"]
  }
];

export default function CebuTourismSection() {
  const [selectedLocation, setSelectedLocation] = useState<typeof tourismData[0] | null>(null);

  const openModal = (location: typeof tourismData[0]) => {
    setSelectedLocation(location);
  };

  const closeModal = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="w-full py-12 pt-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-muted-foreground">Best location</h3>
            <h2 className="text-4xl font-bold text-foreground">Cebu Tourism</h2>
            <p className="text-lg text-muted-foreground max-w-xl mt-2">
              Extraordinary beauty, enjoy the rich culture, and experience
              the friendliness of the local people
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {tourismData.map((location) => (
              <div 
                key={location.id}
                className="group relative rounded-3xl overflow-hidden min-h-[250px] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                onClick={() => openModal(location)}
              >
                <Image
                  src={location.image}
                  alt={location.title}
                  width={600}
                  height={450}
                  className="w-full min-h-[250px] object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-2">{location.title}</h3>
                  <p className="text-sm text-white/90 line-clamp-2">{location.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {location.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {location.groupSize}
                    </div>
                  </div>
                </div>
                
                {/* Click indicator */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="relative">
              <Image
                src={selectedLocation.image}
                alt={selectedLocation.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-3">{selectedLocation.title}</h2>
              
              <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{selectedLocation.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{selectedLocation.groupSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Cebu, Philippines</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {selectedLocation.description}
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Highlights</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLocation.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
                  Book Now
                </button>
                <button 
                  onClick={closeModal}
                  className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}