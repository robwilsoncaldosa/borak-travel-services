
import Image from 'next/image';
import Chatbot from "@/components/ui/chatboot";

export default function Page() {
    return (
        <div className="relative h-screen w-full">
            <Image 
                src={'/Landing.jpg'} 
                alt='landing-page' 
                fill
                className='object-cover z-0'
                priority
                quality={100}
            />
            <div className="relative z-10 uppercase flex flex-col h-full items-center justify-center text-white">
                <h1 className="text-7xl font-extrabold tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                    Borak van rentals
                </h1>
                <h2 className="text-7xl mt-4 font-bold tracking-wide drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                    Packages & Extras
                </h2>
                <p className='text-2xl mt-6 font-bold tracking-wider italic max-w-2xl text-center capitalize'>
                    Exploring Cebu is an unforgettable adventure.
                </p>
            </div>
            {/* Chatbot component at the lower right */}
            <div className="fixed bottom-4 right-4 z-50">
                <Chatbot />
            </div>
        </div>
    );
}
