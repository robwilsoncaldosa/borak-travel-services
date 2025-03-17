import Image from 'next/image';
import Packages from '@/components/ui/packages'

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
                    <button className="mt-8 bg-[#2E2E2E] text-white px-8 py-3 rounded-md text-xl font-semibold tracking-wide transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-lg hover:shadow-xl">
                        Book Now
                    </button>
                </div>
            </div>

            <div className="pt-10 flex flex-col items-center justify-center bg-white">
                <h1 className="text-4xl font-bold mb-8 text-[#2E2E2E]">We offer Van rental with Packages</h1>
                {/* Add your packages content here */}
            </div>
            <div>
                <Packages />
            </div>
        </>
    );
}
