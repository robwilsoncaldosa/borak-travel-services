import Chatbot from "@/components/ui/chatbot";
import AnimatedPage from "./_components/animated-page";

export default function Page() {
  return (
    <>
      <AnimatedPage />
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>
    </>
  );
}