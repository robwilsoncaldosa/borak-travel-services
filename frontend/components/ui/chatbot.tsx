"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageCircle, X, Bot, MapPin, Plane, PalmtreeIcon, SunIcon, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


import { chatApi, ChatMessage } from "@/lib/backend_api/chat";
import { guestApi, GuestCreateDto } from "@/lib/backend_api/guest";
import { io, Socket } from "socket.io-client";


let socket: Socket;


interface Message {
  id?: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  isSpecialOffer?: boolean;
  userId?: string;
  username?: string;
  isAdmin?: boolean; 
}


const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 



  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


   useEffect(() => {
    const storedUserId = localStorage.getItem("guestUserId");
    const storedUsername = localStorage.getItem("guestUsername");


    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
      setGuestReady(true);
    }


    console.log("Guest User ID:", storedUserId, "Guest Username:", storedUsername);
    return () => {
      localStorage.removeItem("guestUserId");
      localStorage.removeItem("guestUsername");
    };
  }, []);


const loadMessages = useCallback(async () => {
    try {
      const data = await chatApi.getMessagesByUserId(userId || '');
      setMessages(data.map(formatMessage));
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }, [userId]);

 useEffect(() => {
  if (!isOpen || !guestReady || !userId) return;


  socket = io(process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:8081");

  socket.on("message", handleIncomingMessage);

  // loadMessages();
  const interval = setInterval(() => {
    if (userId) loadMessages();
  }, 1000);

  return () => {
    socket?.off("message", handleIncomingMessage);
    clearInterval(interval);
  };
}, [isOpen, guestReady, userId,loadMessages]);


const [unreadCount, setUnreadCount] = useState(0);

const handleIncomingMessage = (message: ChatMessage) => {

  //this is for the bot
  const isFromBot = message.isAdmin ?? message.username === "Bot"; 


  setMessages(prev => {
   
    if (prev.some(m => m.id === message.id)) return prev;
    return [
      ...prev,
      {
        id: message.id,
        sender: isFromBot ? "bot" : "user",
        text: message.message || "",
        timestamp: new Date(message.timestamp),
        isSpecialOffer: message.isSpecialOffer,
        userId: message.userId,
        username: message.username,
        isAdmin: message.isAdmin
      }
    ];
  });
  if (!isOpen) setUnreadCount(count => count + 1);
};

useEffect(() => {
  if (isOpen) setUnreadCount(0);
}, [isOpen]);


const formatMessage = (msg: ChatMessage): Message => ({
  id: msg.id,
  sender: msg.isAdmin ? "bot" : "user",
  text: msg.message || "",
  timestamp: new Date(msg.timestamp),
  isSpecialOffer: msg.isSpecialOffer,
  userId: msg.userId,
  username: msg.username,
  isAdmin: msg.isAdmin
});




  const createGuest = async () => {
    if (!username.trim() || !email.trim()) return;


    try {
    
      if (!email.includes('@')) {
        console.error('Only email is supported at the moment');
        return;
      }


      const payload: GuestCreateDto = {
        username,
        email: email
      };


      const created = await guestApi.createGuest(payload);
      localStorage.setItem("guestUserId", created.id);
      localStorage.setItem("guestUsername", created.username);
      setUserId(created.id);
      setGuestReady(true);
    } catch (error) {
      console.error("Failed to create guest:", error);
    }
  };


  const handleSend = async () => {
    if (!input.trim() || !userId) return;
   
    const userMessage: ChatMessage = {
      sender: "user",
      message: input,
      timestamp: new Date(),
      userId,
      username,
    };


    try {
      
      const createdMessage = await chatApi.createMessage(userMessage);
     
      // Update local state with the created message
      setMessages((prev) => [...prev, {
        ...userMessage,
        id: createdMessage.id,
        text: userMessage.message
      } as Message]);
     
      if (socket) {
        socket.emit("sendMessage", createdMessage);
      }
      setInput("");
      setIsTyping(true);
     
      // Handle bot response
      setTimeout(async () => {
        setIsTyping(false);
       
        let responseText = "Hello! How can I help you plan your perfect travel experience?";
        let isSpecialOffer = false;
        const lowerInput = input.toLowerCase();


        if (lowerInput.includes("package") || lowerInput.includes("tour") || lowerInput.includes("offer")) {
          responseText = "We have several exciting tour packages available in Cebu! Would you like to explore our Oslob Whale Shark Watching or Kawasan Falls adventures?";
          isSpecialOffer = true;
        } else if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("how much")) {
          responseText = "Our tour packages start from ₱1,500 per person. May I know which destination you're interested in?";
        } else if (lowerInput.includes("book") || lowerInput.includes("reserve")) {
          responseText = "Great! To book a tour, we'll need your preferred date, number of travelers, and pickup location. When are you planning to visit?";
        }
       
        const botMessage: ChatMessage = {
          sender: "bot",
          message: responseText,
          timestamp: new Date(),
          isSpecialOffer,
          userId,
          username: "Bot",
          isAdmin: true // <-- Ensure this is set!
        };


        try {
         
          // Persist the bot message to backend
          const createdBotMessage = await chatApi.createMessage(botMessage);

          // Update local state with the created bot message
          setMessages((prev) => [...prev, {
            ...botMessage,
            id: createdBotMessage.id,
            text: botMessage.message,
            isAdmin: true
          } as Message]);

          // Emit the bot message through socket for real-time update
          if (socket) {
            socket.emit("sendMessage", createdBotMessage);
          }
        } catch (error) {
          console.error("Failed to send bot message:", error);
        }
      }, 1500);
     
    } catch (error) {
      console.error("Failed to send message:", error);
    }
};


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!guestReady) {
        createGuest();
      } else {
      handleSend();
    }
    }
  };

 
  const renderGuestForm = () => (
    <motion.div
      key="guestForm"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="w-80 sm:w-96 bg-white shadow-2xl rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-[#2E2E2E]">Welcome 👋</h2>
      <p className="text-sm mb-4 text-gray-600">Please enter your name and email/phone to start chatting.</p>
      <input
        type="text"
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded-lg text-sm focus:outline-none"
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-lg text-sm focus:outline-none"
      />
      <button
        onClick={createGuest}
        className="w-full py-2 bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white rounded-lg text-sm font-medium hover:shadow-md"
      >
        Start Chat
      </button>
    </motion.div>
  );




  const handleClose = () => {
    setIsOpen(false);
    // Clear guest credentials when closing chat
    localStorage.removeItem("guestUserId");
    localStorage.removeItem("guestUsername");
    setUserId(null);
    setUsername("");
    setEmail("");
    setGuestReady(false);
    setMessages([]);
  };


  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="p-4 bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </motion.button>
        ) :guestReady? (
          <motion.div
            key="chatbox"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-80 sm:w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white font-semibold flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1 left-1 transform rotate-45"><Globe size={12} /></div>
                <div className="absolute top-2 right-8 transform -rotate-12"><Plane size={12} /></div>
                <div className="absolute bottom-2 left-12"><PalmtreeIcon size={12} /></div>
                <div className="absolute bottom-1 right-2"><SunIcon size={12} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="text-lg">Travel Assistant</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-white rounded-full p-1 hover:bg-[#444444] transition-colors z-50"
                aria-label="Close chat"
              >
                <X size={18} />
              </motion.button>
            </div>
           
            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 space-y-3 bg-opacity-80">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-4 p-6  rounded-xl  bg-opacity-90">
                  <div className="relative inline-block">
                    <Bot size={48} className="mx-auto mb-3 text-[#2E2E2E]" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#2E2E2E] to-[#444444] rounded-full flex items-center justify-center">
                      <Globe size={12} className="text-white" />
                    </div>
                  </div>
                  <p className="font-medium text-lg text-[#2E2E2E]">Welcome to Borak Travel Services!</p>
                  <p className="text-sm mt-2 text-gray-600">How can I help you plan your perfect trip today?</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button onClick={() => setInput("Show me popular tours")} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#2E2E2E] rounded-full transition-colors duration-200 border border-gray-200">
                      <span className="flex items-center"><MapPin size={12} className="mr-1" /> Popular tours</span>
                    </button>
                    <button onClick={() => setInput("What are your prices?")} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#2E2E2E] rounded-full transition-colors duration-200 border border-gray-200">
                      <span className="flex items-center"><SunIcon size={12} className="mr-1" /> Pricing</span>
                    </button>
                    <button onClick={() => setInput("How to book a tour?")} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#2E2E2E] rounded-full transition-colors duration-200 border border-gray-200">
                      <span className="flex items-center"><Plane size={12} className="mr-1" /> Booking</span>
                    </button>
                  </div>
                </div>
              )}
             
              {(() => {
                const renderedIds = new Set();
                return messages.map((msg) => {
                  if (msg.id && renderedIds.has(msg.id)) {
                    // Skip rendering duplicates entirely
                    return null;
                  }
                  if (msg.id) renderedIds.add(msg.id);
                  return (
                    <motion.div
                      key={msg.id || `${msg.sender}-${msg.timestamp.getTime()}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex max-w-[80%] ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                        {msg.isAdmin ? (
                          <>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 bg-[#2E2E2E]">
                              <Bot size={16} className="text-white" />
                            </div>
                            <div className="p-3 rounded-2xl shadow-sm bg-white border border-gray-200">
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-[10px] mt-1 opacity-70 text-right">
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 rounded-2xl shadow-sm bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white">
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-[10px] mt-1 opacity-70 text-right">
                              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                });
              })()}
             
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 bg-[#2E2E2E]">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="p-3 rounded-2xl shadow-sm bg-white border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
             
              <div ref={messagesEndRef} />
            </div>
           
           
            {/* Input area */}
            <div className="p-3 bg-white border-t border-gray-200 bg-opacity-90">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-1 border border-gray-200 shadow-inner">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your travel question..."
                  className="flex-1 bg-transparent py-2 px-1 focus:outline-none text-gray-800 placeholder-gray-400"
                  aria-label="Type a message"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`ml-2 p-2 rounded-full ${input.trim() ? 'bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white shadow-sm' : 'bg-gray-300 text-gray-500'} transition-all duration-200`}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
       
      ) : (
        renderGuestForm()
        )}
      </AnimatePresence>
    </div>
  );
};


export default Chatbot;

