"use client"
import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

//Nya ra nako ni ibalhin ang types doo kai not sure pako if unsa imo plan sa placement structure sa frontend, kaw lang ya bahala balhin for good bwahahha, PWEDE rasad ako but mo observe pako sa imong folder structure kai bacn lahi akoa
interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTimeout(() => {
      const botMessage: Message = { sender: "bot", text: "Hello! How can I help you?" };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 bg-blue-500 text-white font-semibold flex justify-between items-center">
            <span>Chatbot</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl">×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex items-center border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border p-2 rounded-lg"
            />
            <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;