import Image from 'next/image';

interface Package {
    id: number;
    title: string;
    image: string;
    description: string;
    inclusions: string[];
    price: string;
}

const packages: Package[] = [
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

export default function PackageCards() {
    return (
        <div className="py-5">
            <div className="max-w-[1400px] mx-auto">              
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 px-[50px] md:px-[50px] lg:px-[70px] px:xl-0 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="relative h-[250px]">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-[#2E2E2E] mb-3">{pkg.title}</h2>
                                
                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {pkg.description}
                                </p>
                                
                                <div className="space-y-3 mb-6">
                                    <h3 className="font-semibold text-gray-700 mb-3">Package Inclusions:</h3>
                                    {pkg.inclusions.map((inclusion, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-600">{inclusion}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                                    <div>
                                        <span className="text-sm text-gray-500">Starting from</span>
                                        <p className="text-2xl font-bold text-[#2E2E2E]">{pkg.price}</p>
                                    </div>
                                    <button className="bg-[#2E2E2E] text-white px-6 py-2.5 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-gray-700 hover:scale-105">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}