import Image from 'next/image';
import PackageCards, { Package } from '@/components/ui/packages';

// Package data moved to the page component
const packageData: Package[] = [
    {
        id: 1,
        title: "Cebu City Tour",
        image: "/contactbg.jpg",
        description: "Explore the historic and cultural landmarks of Cebu City. Visit famous sites like Magellan's Cross, Basilica del Santo Niño, and Temple of Leah. Perfect for history enthusiasts and first-time visitors.",
        inclusions: [
            "10 Hours Duration",
            "Fuel & Toll Fees",
            "Pickup & Drop-off Service"
        ],
        price: "₱4,500"
    },
    {
        id: 2,
        title: "South Cebu Adventure",
        image: "/contactbg.jpg",
        description: "Experience the natural wonders of South Cebu. Chase waterfalls at Kawasan, swim with whale sharks in Oslob, and enjoy the white sand beaches of Moalboal. Perfect for adventure seekers.",
        inclusions: [
            "12 Hours Duration",
            "Fuel & Toll Fees",
            "Pickup & Drop-off Service"
        ],
        price: "₱5,500"
    },
    {
        id: 3,
        title: "North Cebu Expedition",
        image: "/contactbg.jpg",
        description: "Discover the hidden gems of North Cebu. Visit the pristine beaches of Bantayan Island, explore the cultural sites of Malapascua, and enjoy local delicacies. Perfect for beach lovers.",
        inclusions: [
            "12 Hours Duration",
            "Fuel & Toll Fees",
            "Pickup & Drop-off Service"
        ],
        price: "₱5,500"
    }
];

export default function Page() {
    return (
        <>
            <div className="h-[600px] w-full relative">
                {/* Background Image */}
                <Image
                    src={'/Landing.jpg'}
                    alt='landing-page'
                    fill
                    className='object-cover z-0'
                    priority
                    quality={100}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />

                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full items-center justify-center text-white">
                    <h1 className="text-7xl font-extrabold tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                        Explore & Packages
                    </h1>
                
                </div>
            </div>

            <div className="pt-10 flex flex-col items-center justify-center bg-white">
                <h1 className="text-4xl font-bold mb-8 text-[#2E2E2E]">We offer Van rental with Packages</h1>
            </div>
            <div>
                <PackageCards packages={packageData} />
            </div>
        </>
    );
}
