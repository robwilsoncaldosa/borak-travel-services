"use client"
import Contact from "@/components/ui/homecontact"


function BookNowSection() {
  return (
    <div className="relative w-full py-16 bg-[url('/contactbg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mt-2">Contact Us</h2>
          <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
            Ready to explore Cebu? Fill out the form below to book your van rental and experience the beauty of the Philippines with our professional service.
          </p>
        </div>
        <Contact />

        <div className="mt-12 text-center">
          <p className="text-white/80">
            Need help with your booking? Call us at <span className="font-semibold text-white">+63 917 589 1678</span> or email <span className="font-semibold text-white">boraktravel@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookNowSection;