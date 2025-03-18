import Image from "next/image";
import { BookNowButton } from "./_components/book-now-button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageForm from "./_components/landing-page-form";
import { H1 } from "@/components/ui/typography";
import Chatbot from "@/components/ui/chatbot";

export default function Page() {
  return (
    <div className="">
      <div className="relative h-screen w-full">
        <Image
          src={"/landing-page.png"}
          alt="landing-page"
          fill
          className="object-cover z-0"
          priority
          quality={100}
        />
        <div className="relative z-10 uppercase flex flex-col h-full items-center justify-center text-white">
          <h1 className="text-7xl font-extrabold capitalize tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
            Borak van rentals
          </h1>
          <h2 className="text-7xl mt-4 capitalize font-bold tracking-widest drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
            Packages & Extras
          </h2>
          <p className="text-2xl mt-6 font-bold tracking-wider  max-w-2xl text-center capitalize">
            Exploring Cebu is an unforgettable adventure.
          </p>
          <BookNowButton />

          <Card className="rounded-4xl shadow-lg absolute top-[88dvh] w-full lg:w-11/12 px-4">
            <CardContent>
              <LandingPageForm />
            </CardContent>
          </Card>
      </div>{" "}
    </div>
    <section className="min-h-screen lg:p-20 p-0">
      <H1 className="text-center">Most Affordable & Best Selling Van rental with packages</H1>
    </section>
    <div className="fixed bottom-4 right-4 z-50">
      <Chatbot />
    </div>
  </div>
  );
}
