import GoogleMapComponent from '@/components/ui/map';
import Contact from '@/components/ui/contact';

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center">
      <Contact />
      <div className=' w-full max-w-[1150px] mx-auto pb-10'>
        <GoogleMapComponent />
      </div>
    </div>
  );
}
