import GoogleMapComponent from '@/components/ui/map';
import Contact from '@/components/ui/contact';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="h-[600px] w-full absolute inset-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src={'/contactbg.jpg'}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center pt-[160px]">

        <div className="text-center mb-[100px] max-w-[1100px] mx-auto">
          <h1 className="text-7xl font-extrabold tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
            Get In Touch</h1>
          <p className="pt-2 text-[18px] font-medium tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
            Have questions about our tours, need expert travel advice, or ready to book your next adventure? Reach out to us today, and our team will help you create the perfect travel experience tailored just for you.</p>
        </div>
        <Contact />
      </div>
      <div className=' w-full max-w-[1100px] pb-10'>
        <GoogleMapComponent />
      </div>
    </div>
  );
}
