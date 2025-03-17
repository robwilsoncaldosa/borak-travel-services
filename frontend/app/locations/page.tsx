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

const DestinationPage = () => {
  const [pickup, setPickup] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [L, setL] = useState<any>(null);
  const [icons, setIcons] = useState<{ pickupIcon: any; destinationIcon: any } | null>(null);

  // Load Leaflet and create custom icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      const leaflet = require("leaflet");
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
    }
  }, []);

  const getRoute = async () => {
    if (!pickup || !destination) return;
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    const url = `https://api.maptiler.com/routing/v2/route/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        setRoute(
          data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])
        );
      }
    } catch (error) {
      console.error("Error fetching route:", error);
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
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your current location</Popup>
            </Marker>
          )}
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
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>

      {/* Input fields are now positioned below the map container */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md mt-4">
        <input
          type="text"
          placeholder="Pickup (Lat,Lng)"
          className="border p-2 rounded-md mb-2 w-full"
          onBlur={(e) => {
            const [lat, lng] = e.target.value.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) setPickup({ lat, lng });
          }}
        />
        <input
          type="text"
          placeholder="Destination (Lat,Lng)"
          className="border p-2 rounded-md mb-2 w-full"
          onBlur={(e) => {
            const [lat, lng] = e.target.value.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) setDestination({ lat, lng });
          }}
        />
        <div className="mt-2 text-center">
          {distance && <p>Distance: {Math.round(distance / 1000)} km</p>}
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
