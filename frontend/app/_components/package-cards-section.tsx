"use client";

import PackageCard from "@/app/_components/package-card";

export default function PackageCardsSection() {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full justify-evenly px-4 md:px-0 py-4 md:py-0">
      <PackageCard
        backgroundImage="https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=1470&auto=format&fit=crop"
        title="Cebu Island Hopping"
        description="Explore the pristine islands and crystal clear waters around Cebu with our premium island hopping package."
        hoverContent="Visit Sumilon Island, Pescador Island, and swim with sardines in Moalboal. All transportation and lunch included!"
        buttonText="Book Now"
        onBookNow={() => console.log("Booked Island Hopping Package")}
      />
      <PackageCard
        backgroundImage="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1374&auto=format&fit=crop"
        title="Whale Shark Experience"
        description="Swim with the gentle giants of Oslob in this once-in-a-lifetime whale shark encounter tour."
        hoverContent="Early morning departure, includes professional guides, safety equipment, and breakfast. Perfect for families and adventure seekers!"
        buttonText="Book Now"
        onBookNow={() => console.log("Booked Whale Shark Package")}
      />
      <PackageCard
        backgroundImage="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?q=80&w=1470&auto=format&fit=crop"
        title="Kawasan Falls Adventure"
        description="Experience the majestic turquoise waters of Kawasan Falls with our canyoneering and waterfall adventure."
        hoverContent="Full day of canyoneering, cliff jumping, and swimming in Kawasan's famous blue lagoons. Includes gear, guides, and lunch."
        buttonText="Book Now"
        onBookNow={() => console.log("Booked Kawasan Falls Package")}
      />
    </div>
  );
}