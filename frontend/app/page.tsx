import Image from 'next/image';
import Chatbot from "@/components/ui/chatbot";
import Packages from "@/components/ui/packages";
import Contact from '@/components/ui/contact';
import Reviews from '@/components/ui/reviews';

export default function Page() {
    return (
        <main>
            <div className="relative h-screen w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
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

            {/* Packages */}
            <div className='pt-10 flex flex-col items-center justify-center bg-white'>
                <h1 className='text-4xl font-bold mb-8 text-[#2E2E2E]'>Most Affordable & Best Selling Van rental with packages</h1>
                <Packages />
            </div>

            <div className='pt-10 flex flex-col items-center justify-center bg-white'>
                {/* <h1 className='text-4xl font-bold mb-8 text-[#2E2E2E]'>Our Reviews</h1> */}
                <Reviews />
            </div>

            {/* Contact Information */}
            <div className='pt-10 flex flex-col items-center justify-center bg-white'>
                <div className='flex max-w-[1150px] flex-col items-center justify-center'>
                    <h1 className='text-4xl font-bold mb-2 text-[#2E2E2E] '>Get In Touch</h1>
                    <p className='text-[18px] pb-10'>Have questions about our tours, need expert travel advice, Ali na.</p>
                </div>

                <Contact />
            </div>
        </main>
    );
}
