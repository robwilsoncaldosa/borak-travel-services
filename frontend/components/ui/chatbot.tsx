"use client"
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Send, MessageCircle, X, Bot, MapPin, Plane, PalmtreeIcon, SunIcon, Globe, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { chatApi, ChatMessage } from "@/lib/backend_api/chat";
import { guestApi, GuestCreateDto } from "@/lib/backend_api/guest";
import { io, Socket } from "socket.io-client";
import { ChatImageUpload, ChatImageUploadRef } from "@/components/cloudinary/ChatImageUpload";

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
  imageUrls?: string[];
}

// Move ImageModal outside of Chatbot component and memoize it
const ImageModal = memo(({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    const img = new window.Image();
    img.src = imageUrl;
    
    img.onload = () => {
      hasLoadedRef.current = true;
      setIsLoading(false);
    };

    return () => {
      hasLoadedRef.current = false;
    };
  }, [imageUrl]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center w-full h-[calc(100%-1rem)] max-h-full"
      onClick={onClose}
    >
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Image Preview
            </h3>
            <button 
              type="button" 
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          
          {/* Modal body */}
          <div className="p-4 space-y-4">
            <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-600" />
                </div>
              )}
              <Image
                ref={imgRef}
                src={imageUrl}
                alt="Expanded image"
                fill
                className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                priority
                sizes="(max-width: 80vw) 80vw, 80vw"
                quality={100}
                onLoad={() => {
                  if (!hasLoadedRef.current) {
                    hasLoadedRef.current = true;
                    setIsLoading(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [, setLocalIsOpen] = useState(false); // Renamed from isOpen
  const [isTyping, setIsTyping] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [adminHasReplied, setAdminHasReplied] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const imageUploadRef = useRef<ChatImageUploadRef>(null);
  // const imageCache = useRef<Map<string, boolean>>(new Map());

  // Check session timeout
  const checkSessionTimeout = useCallback(() => {
    const lastActive = localStorage.getItem("lastActive");
    if (lastActive) {
      const lastActiveTime = new Date(lastActive).getTime();
      const currentTime = new Date().getTime();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      if (currentTime - lastActiveTime > oneHour) {
        // Session expired
        localStorage.removeItem("guestUserId");
        localStorage.removeItem("guestUsername");
        localStorage.removeItem("lastActive");
        setUserId(null);
        setUsername("");
        setEmail("");
        setGuestReady(false);
        setAdminHasReplied(false);
        setMessages([]);
        return true;
      }
      return false;
    }
    return true;
  }, []);

  // Update last active time
  const updateLastActive = useCallback(() => {
    localStorage.setItem("lastActive", new Date().toISOString());
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("guestUserId");
    const storedUsername = localStorage.getItem("guestUsername");

    if (storedUserId && storedUsername && !checkSessionTimeout()) {
      setUserId(storedUserId);
      setUsername(storedUsername);
      setGuestReady(true);
      updateLastActive();
    }
  }, [checkSessionTimeout, updateLastActive]);

  // Update last active time when chat is opened
  useEffect(() => {
    if (isOpen && guestReady) {
      updateLastActive();
    }
  }, [isOpen, guestReady, updateLastActive]);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldAutoScroll]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isAtBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

    const interval = setInterval(() => {
      if (userId) loadMessages();
    }, 1000);

    return () => {
      socket?.off("message", handleIncomingMessage);
      clearInterval(interval);
    };
  }, [isOpen, guestReady, userId, loadMessages]);

  const [unreadCount, setUnreadCount] = useState(0);

  const handleIncomingMessage = (message: ChatMessage) => {
    const isFromHumanAdmin = message.isAdmin && message.username !== "Bot";
    if (isFromHumanAdmin) {
      setAdminHasReplied(true);
    }

    const isFromBotOrAdmin = message.isAdmin || message.username === "Bot";

    setMessages(prev => {
      if (prev.some(m => m.id === message.id)) return prev;
      return [
        ...prev,
        {
          id: message.id,
          sender: isFromBotOrAdmin ? "bot" : "user",
          text: message.message || "",
          timestamp: new Date(message.timestamp),
          isSpecialOffer: message.isSpecialOffer,
          userId: message.userId,
          username: message.username,
          isAdmin: message.isAdmin,
          imageUrls: message.imageUrls,
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
    sender: msg.isAdmin || msg.username === "Bot" ? "bot" : "user",
    text: msg.message || "",
    timestamp: new Date(msg.timestamp),
    isSpecialOffer: msg.isSpecialOffer,
    userId: msg.userId,
    username: msg.username,
    isAdmin: msg.isAdmin,
    imageUrls: msg.imageUrls,
  });

  // const handleClose = () => {
  //   setIsOpen(false);
  //   updateLastActive();
  // };

  const preloadImage = useCallback((url: string) => {
    if (preloadedImages.has(url)) return;
    
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, url]));
    };
  }, [preloadedImages]);

  useEffect(() => {
    if (selectedImage) {
      preloadImage(selectedImage);
    }
  }, [selectedImage, preloadImage]);

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
      localStorage.setItem("lastActive", new Date().toISOString());
      setUserId(created.id);
      setGuestReady(true);
    } catch (error) {
      console.error("Failed to create guest:", error);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && imageUrls.length === 0) || !userId) return;
   
    const shouldSuppressBotReply = adminHasReplied;
    setAdminHasReplied(false);

    const userMessage: ChatMessage = {
      sender: "user",
      message: input,
      timestamp: new Date(),
      userId,
      username,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    };

    try {
      const createdMessage = await chatApi.createMessage(userMessage);
     
      setMessages((prev) => [...prev, {
        ...userMessage,
        id: createdMessage.id,
        text: userMessage.message,
        imageUrls: userMessage.imageUrls,
      } as Message]);
     
      if (socket) {
        socket.emit("sendMessage", createdMessage);
      }
      const currentInput = input;
      setInput("");
      setImageUrls([]);
      imageUploadRef.current?.clearPreviews();
      setIsTyping(true);
     
      if (!shouldSuppressBotReply) {
        setTimeout(async () => {
          setIsTyping(false);
         
          let responseText = "";
          let isSpecialOffer = false;
          const lowerInput = currentInput.toLowerCase();

          if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
            responseText = `Hi ${username}! How can I assist you with your travel plans today?`;
          } else if (lowerInput.includes("package") || lowerInput.includes("tour") || lowerInput.includes("offer")) {
            responseText = "We have several exciting tour packages available in Cebu! Would you like to explore our Oslob Whale Shark Watching or Kawasan Falls adventures?";
            isSpecialOffer = true;
          } else if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("how much")) {
            responseText = "Our tour packages start from ₱1,500 per person. May I know which destination you're interested in for a more specific quote?";
          } else if (lowerInput.includes("book") || lowerInput.includes("reserve")) {
            responseText = "Great! To book a tour, we'll need your preferred date, number of travelers, and pickup location. When are you planning to visit?";
          } else if (lowerInput.includes("oslob")) {
            responseText = "Our Oslob Whale Shark Watching tour is very popular! It includes snorkeling with the gentle giants. Would you like more details or pricing?";
            isSpecialOffer = true;
          } else if (lowerInput.includes("kawasan")) {
            responseText = "Kawasan Falls offers a breathtaking canyoneering adventure! It's perfect for thrill-seekers. Interested in learning more?";
            isSpecialOffer = true;
          } else if (lowerInput.includes("payment") || lowerInput.includes("pay")) {
            responseText = "We accept various payment methods including online bank transfer, GCash, and credit/debit cards through a secure payment link. Which method do you prefer?";
          } else if (lowerInput.includes("contact") || lowerInput.includes("number") || lowerInput.includes("call")) {
            responseText = "You can reach us at contact@boraktravel.com or call us at +63 917 123 4567 for urgent concerns. How else can I help?";
          } else if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
            responseText = "You're very welcome! Is there anything else I can help you with?";
          } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
            responseText = "Goodbye! Have a great day and feel free to reach out if you need assistance in the future.";
          } else {
            responseText = "I'm here to help with your travel plans. Could you please specify what you're looking for? You can ask about tours, pricing, or how to book.";
          }
         
          const botMessage: ChatMessage = {
            sender: "bot",
            message: responseText,
            timestamp: new Date(),
            isSpecialOffer,
            userId,
            username: "Bot",
            isAdmin: true
          };

          try {
            const createdBotMessage = await chatApi.createMessage(botMessage);

            setMessages((prev) => [...prev, {
              ...botMessage,
              id: createdBotMessage.id,
              text: botMessage.message,
              isAdmin: true
            } as Message]);

            if (socket) {
              socket.emit("sendMessage", createdBotMessage);
            }
          } catch (error) {
            console.error("Failed to send bot message:", error);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);
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
    onClose();
    // setIsOpen(false);
    // Clear guest credentials when closing chat
    localStorage.removeItem("guestUserId");
    localStorage.removeItem("guestUsername");
    setUserId(null);
    setUsername("");
    setEmail("");
    setGuestReady(false);
    setAdminHasReplied(false); // Reset admin replied state
    setMessages([]);
  };


  // Remove all usage of setIsOpen and use the prop isOpen for visibility
  // For example, to close the chatbot, call onClose()

  // Remove or refactor any code that toggles localIsOpen or setIsOpen

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {selectedImage && (
          <ImageModal
            key={selectedImage}
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocalIsOpen(true)}
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
        ) : guestReady ? (
          <motion.div
            key="chatbox"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-80 sm:w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden backdrop-blur-sm"
          >
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
           
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 space-y-3 bg-opacity-80"
            >
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
                    return null;
                  }
                  if (msg.id) renderedIds.add(msg.id);
                  return (
                    <motion.div
                      key={msg.id || `${msg.sender}-${msg.timestamp.getTime()}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex max-w-[80%] ${msg.sender === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                        {msg.sender === 'bot' ? (
                          <>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 bg-[#2E2E2E]">
                              <Bot size={16} className="text-white" />
                            </div>
                            <div className="p-3 rounded-2xl shadow-sm bg-white border border-gray-200">
                              {msg.imageUrls && msg.imageUrls.length > 0 && (
                                <div className={`mb-2 ${msg.imageUrls.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-2'}`}>
                                  {msg.imageUrls.map((url, index) => {
                                    const isSingleImage = msg.imageUrls?.length === 1;
                                    return (
                                      <div 
                                        key={url} 
                                        className={`relative ${isSingleImage ? 'w-full aspect-[4/3]' : 'w-30 h-30'} rounded-lg overflow-hidden group cursor-pointer`}
                                        onClick={() => setSelectedImage(url)}
                                      >
                                        <Image
                                          src={url}
                                          alt={`Message attachment ${index + 1}`}
                                          fill
                                          className="object-cover transition-transform group-hover:scale-105"
                                          sizes={isSingleImage ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 50vw, 25vw"}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <ZoomIn className="h-6 w-6 text-white" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-[10px] mt-1 opacity-70 text-right">
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 rounded-2xl shadow-sm bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white">
                            {msg.imageUrls && msg.imageUrls.length > 0 && (
                              <div className={`mb-2 ${msg.imageUrls.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-2'}`}>
                                {msg.imageUrls.map((url, index) => {
                                  const isSingleImage = msg.imageUrls?.length === 1;
                                  return (
                                    <div 
                                      key={url} 
                                      className={`relative ${isSingleImage ? 'w-full aspect-[4/3]' : 'w-30 h-30'} rounded-lg overflow-hidden group cursor-pointer`}
                                      onClick={() => setSelectedImage(url)}
                                    >
                                      <Image
                                        src={url}
                                        alt={`Message attachment ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        sizes={isSingleImage ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 50vw, 25vw"}
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ZoomIn className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
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
           
            <div className="p-3 bg-white border-t border-gray-200 bg-opacity-90">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-1 border border-gray-200 shadow-inner">
                <ChatImageUpload
                  ref={imageUploadRef}
                  onImageUpload={(urls) => {
                    setImageUrls(urls);
                    urls.forEach(url => preloadImage(url));
                  }}
                  disabled={!guestReady}
                />
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
                  disabled={!input.trim() && imageUrls.length === 0}
                  className={`ml-2 p-2 rounded-full ${(input.trim() || imageUrls.length > 0) ? 'bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white shadow-sm' : 'bg-gray-300 text-gray-500'} transition-all duration-200`}
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

