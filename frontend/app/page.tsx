'use client';

import Chatbot from "@/components/ui/chatbot";
import AnimatedPage from "./_components/animated-page";
import { useState } from "react";
import { MessageCircle } from "lucide-react"; // Import the icon

export default function Page() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <AnimatedPage />
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
        {!isChatbotOpen && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="p-4 bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle size={24} className="text-white" /> {/* Black chatbot icon */}
          </button>
        )}
      </div>
    </>
  );
}