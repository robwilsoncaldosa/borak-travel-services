"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

const CEBU_CENTER: [number, number] = [10.3157, 123.8854];
const CEBU_BOUNDS: [[number, number], [number, number]] = [
  [9.2051, 123.5296],
  [11.3177, 125.2199],
];

// Function to calculate distance using the Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface GeoFeature {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  text: string;
  context?: Array<{ id: string; text: string }>;
}

const DestinationPage = () => {
  // Add new state for map loading
  const [isMapReady, setIsMapReady] = useState(false);

  const [pickup, setPickup] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [L, setL] = useState<any>(null);
  const [icons, setIcons] = useState<{ pickupIcon: any; destinationIcon: any } | null>(null);
  const [searchResults, setSearchResults] = useState<GeoFeature[]>([]);

  const [isPickupSearch, setIsPickupSearch] = useState(true);
  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      // Update the API endpoint and parameters
      const url = `https://api.maptiler.com/geocoding/${encodedQuery}.json?key=${apiKey}&proximity=${CEBU_CENTER[1]},${CEBU_CENTER[0]}&bbox=123.5296,9.2051,125.2199,11.3177&country=ph&language=en&limit=10&types=address,poi,place`;

      console.log('Search URL:', url); // For debugging

      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`Search error: ${response.status} - ${response.statusText}`);
        setSearchResults([]);
        return;
      }

      const data = await response.json();
      console.log('Search results:', data); // For debugging
      
      if (data?.features?.length > 0) {
        const validResults = data.features
          .filter((feature: GeoFeature) => 
            feature.center && 
            feature.center.length === 2 &&
            feature.place_name
          )
          .sort((a: GeoFeature, b: GeoFeature) => getPlaceScore(b) - getPlaceScore(a));
        console.log('Valid results:', validResults); // For debugging
        setSearchResults(validResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchResults([]);
    }
  };


  // Helper function to score places by relevance
  const getPlaceScore = (feature: any) => {
    const type = feature.place_type?.[0] || '';
    const properties = feature.properties || {};
    
    // Score based on place type
    switch (type) {
      case 'poi': return 5; // Points of interest (hotels, beaches, tourist spots)
      case 'neighborhood': return 4; // Barangays and local areas
      case 'locality': return 3; // Cities and municipalities
      case 'address': return 2; // Street addresses
      default: return 1;
    }
  };

  // Update the display of search results
  const formatPlaceName = (result: any) => {
    const name = result.text || '';
    const context = result.context || [];
    const relevantContext = context
      .filter((c: any) => c.id.includes('neighborhood') || c.id.includes('locality'))
      .map((c: any) => c.text)
      .join(', ');
    
    return `${name}${relevantContext ? ` - ${relevantContext}` : ''}`;
  };

  const handleLocationSelect = (feature: any) => {
    const [lng, lat] = feature.center;
    const address = feature.place_name;
    
    if (isPickupSearch) {
      setPickup({ lat, lng });
      setPickupInput(address);
    } else {
      setDestination({ lat, lng });
      setDestinationInput(address);
    }
    setSearchResults([]);
  };

  const getRoute = async () => {
    if (!pickup || !destination) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    const url = `https://api.maptiler.com/routing/v2/route/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?key=${apiKey}`;
    try {
      const response = await fetch(url);
      
      // Add error handling for non-OK responses
      if (!response.ok) {
        console.warn(`Route error: ${response.status} - ${response.statusText}`);
        // Create a direct line between points if routing fails
        setRoute([[pickup.lat, pickup.lng], [destination.lat, destination.lng]]);
        return;
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates;
        setRoute(coordinates.map(([lng, lat]: [number, number]) => [lat, lng]));
      } else {
        // Fallback to direct line if no route found
        setRoute([[pickup.lat, pickup.lng], [destination.lat, destination.lng]]);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      // Fallback to direct line if error occurs
      setRoute([[pickup.lat, pickup.lng], [destination.lat, destination.lng]]);
    }
  };

  useEffect(() => {
    console.log("Pickup:", pickup, "Destination:", destination);
  }, [pickup, destination]);

  const getCurrentLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setPickup({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (pickup && destination) {
      getRoute();
      if (userLocation) {
        setDistance(
          calculateDistance(userLocation.lat, userLocation.lng, destination.lat, destination.lng)
        );
      }
    }
  }, [pickup, destination, userLocation]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        const pickupIcon = leaflet.icon({
          iconUrl: "/location.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
        const destinationIcon = leaflet.icon({
          iconUrl: "/destination.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
        setL(leaflet);
        setIcons({ pickupIcon, destinationIcon });
        setIsMapReady(true);
      });
    }
  }, []);

  // Add these new states at the top with other states
  const [isPickupEditing, setIsPickupEditing] = useState(false);
  const [isDestinationEditing, setIsDestinationEditing] = useState(false);

  // Add this useEffect for click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-input')) {
        setIsPickupEditing(false);
        setIsDestinationEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update the input fields section
  // Add this function to calculate approximate travel time (assuming average speed of 30 km/h in city)
  const calculateTravelTime = (distanceInMeters: number) => {
    const speedKmH = 30; // Average city speed in km/h
    const timeHours = (distanceInMeters / 1000) / speedKmH;
    return Math.round(timeHours * 60); // Convert to minutes
  };

  // Update the return JSX
  return (
    <div className="flex flex-col items-center w-full h-[80vh] mt-[100px] relative">
      <div className="w-full max-w-4xl h-[60vh] relative">
        <MapContainer
          center={CEBU_CENTER}
          zoom={12}
          className="w-full h-full rounded-lg shadow-md"
          maxBounds={CEBU_BOUNDS}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            url={`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>'
          />
          
          {pickup && icons?.pickupIcon && (
            <Marker position={[pickup.lat, pickup.lng]} icon={icons.pickupIcon}>
              <Popup>Pickup Location</Popup>
            </Marker>
          )}
          {destination && icons?.destinationIcon && (
            <Marker position={[destination.lat, destination.lng]} icon={icons.destinationIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}
          {route.length > 0 && (
            <Polyline 
              positions={route} 
              color="#dc2626" 
              weight={5} 
              opacity={1} 
              smoothFactor={1}
            />
          )}
        </MapContainer>
      </div>

      <div className="w-full max-w-4xl flex gap-4 mt-4">
        <div className="w-full flex flex-col gap-4">
          {/* First row: Pickup and Distance */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="relative location-input" onClick={() => setIsPickupEditing(true)}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                {(!pickupInput || isPickupEditing) ? (
                  <input
                    type="text"
                    placeholder="Where are you located?"
                    className="border-[1px] border-[#B8B8B8] p-2 pl-8 rounded-[30px] w-full"
                    value={pickupInput}
                    onChange={(e) => {
                      setPickupInput(e.target.value);
                      setIsPickupSearch(true);
                      searchLocation(e.target.value);
                    }}
                  />
                ) : (
                  <div className="p-2 pl-8 w-full text-gray-700">{pickupInput}</div>
                )}
              </div>
              {searchResults.length > 0 && isPickupSearch && (
                <div className="absolute z-10 w-1/2 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleLocationSelect(result)}
                    >
                      <div className="font-medium">{result.text}</div>
                      <div className="text-sm text-gray-600">
                        {result.context?.map((ctx: { text: string }) => ctx.text).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {distance && (
              <div className="min-w-[200px] text-base text-gray-600">
                Distance: {Math.round(distance / 1000)} km away
              </div>
            )}
          </div>

          {/* Second row: Destination and Travel Time */}
          <div className="flex items-center gap-2 mb-20">
            <div className="flex-1">
              <div className="relative location-input" onClick={() => setIsDestinationEditing(true)}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                {(!destinationInput || isDestinationEditing) ? (
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="border-[1px] border-[#B8B8B8] p-2 pl-8 rounded-[30px] w-full"
                    value={destinationInput}
                    onChange={(e) => {
                      setDestinationInput(e.target.value);
                      setIsPickupSearch(false);
                      searchLocation(e.target.value);
                    }}
                  />
                ) : (
                  <div className="p-2 pl-8 w-full text-gray-700">{destinationInput}</div>
                )}
              </div>
              {searchResults.length > 0 && !isPickupSearch && (
                <div className="absolute z-10 w-1/2 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleLocationSelect(result)}
                    >
                      {result.place_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {distance && (
              <div className="min-w-[200px] text-base text-gray-600">
                Time Travel: {calculateTravelTime(distance)} minutes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
