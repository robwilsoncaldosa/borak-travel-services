'use client';

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useMemo, memo } from "react";
import { Bot, Send, User, X, ZoomIn } from "lucide-react";
import { chatApi, ChatMessage } from "@/lib/backend_api/chat";
import { ChatImageUpload, ChatImageUploadRef } from "@/components/cloudinary/ChatImageUpload";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import { io, Socket } from "socket.io-client";

// let socket: Socket;

// Move ImageModal outside of InboxPage component and memoize it
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

export default function InboxPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageUploadRef = useRef<ChatImageUploadRef>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:8081');

    const loadMessages = async () => {
      try {
        const data = await chatApi.getAllMessages();

        const validMessages = data.filter(
          (message) => message && (message.message || message.text) && message.userId
        );

        // Patch guestUsername for each message if it's a guest
        const patchedMessages = validMessages.map((message) => {
          const isGuest = !message.isAdmin;
          return {
            ...message,
            guestUsername: isGuest ? message.username || "Guest" : undefined,
          };
        });

        const sortedMessages = patchedMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Reduced polling frequency

    // Cleanup function
    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('message', (newMessage: ChatMessage) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        return updatedMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('message');
      }
    };
  }, []);
  
  const handleSendReply = async () => {
    if ((!replyMessage.trim() && imageUrls.length === 0) || !selectedChat) return;

    try {
      const newMessage = await chatApi.sendReply(selectedChat, replyMessage, imageUrls);

      const adminMessage: ChatMessage = {
        ...newMessage,
        userId: selectedChat,
        message: replyMessage,
        text: replyMessage,
        isAdmin: true,
        timestamp: new Date(),
        username: 'Admin',
        sender: 'bot',
        isRead: true,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined
      };

      setMessages(prevMessages =>
        [...prevMessages, adminMessage].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      );

      // Emit the new admin message to all clients (real-time)
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', adminMessage);
      }

      setReplyMessage('');
      setImageUrls([]);
      imageUploadRef.current?.clearPreviews();
      
      // Scroll to bottom after sending a message
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const selectedChatMessages = useMemo(() => 
    selectedChat
      ? messages
          .filter(m => m.userId === selectedChat)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      : [],
    [selectedChat, messages]
  );
  
  // Scroll to bottom whenever selected chat messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const latestMessagesByUser: { [userId: string]: ChatMessage } = {};
  messages.forEach((msg) => {
    if (!msg.userId) return; // Skip messages without a userId
    if (
      !latestMessagesByUser[msg.userId] ||
      new Date(msg.timestamp) > new Date(latestMessagesByUser[msg.userId].timestamp)
    ) {
      latestMessagesByUser[msg.userId] = msg;
    }
  });

  const latestMessages = Object.values(latestMessagesByUser).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get unread message count for notification badge
  const unreadCount = latestMessages.filter(msg => !msg.isRead && !msg.isAdmin).length;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedImage && (
          <ImageModal
            key={selectedImage}
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>

      {/* Chat List */}
      <Card className="w-1/3 flex flex-col min-h-0 shadow-md border-0">
        <div className="p-4 flex-shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Messages</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full max-h-full">
            <div className="p-2">
              {latestMessages.map((chat, index) => {
                const recipientUsername = messages.find(m => m.userId === chat.userId && !m.isAdmin)?.username || 'Guest';
                const isLastMessageFromAdmin = chat.isAdmin;
                const messagePreview = (chat.message || chat.text || '').substring(0, 50) + 
                  ((chat.message || chat.text || '').length > 50 ? '...' : '');
                const messageTime = new Date(chat.timestamp);
                const isToday = new Date().toDateString() === messageTime.toDateString();
                const timeString = isToday 
                  ? messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' });

                return (
                  <div
                    key={chat.id || `chat-${index}-${chat.timestamp}`}
                    className={`p-3 cursor-pointer rounded-lg mb-2 transition-all duration-200 hover:shadow-md ${
                      selectedChat === chat.userId
                        ? 'bg-primary/15 shadow-sm'
                        : 'hover:bg-gray-50'
                    } ${!chat.isRead && !chat.isAdmin ? 'border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                    onClick={() => setSelectedChat(chat.userId ?? null)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isLastMessageFromAdmin ? 'bg-primary text-white' : 'bg-gray-100'
                          }`}>
                            {isLastMessageFromAdmin ? <User size={16} /> : <Bot size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate ${
                              !chat.isRead && !chat.isAdmin ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {isLastMessageFromAdmin
                                ? `${recipientUsername}`
                                : `${recipientUsername}`}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {messagePreview}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {timeString}
                            </span>
                            {!chat.isRead && !chat.isAdmin && (
                              <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full mt-1">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {latestMessages.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No messages yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Chat Details with Reply */}
      <Card className="flex-1 flex flex-col min-h-0 shadow-md border-0">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                  <Bot size={16} />
                </div>
                Chat with {messages.find(m => m.userId === selectedChat)?.guestUsername || 'Guest'}
              </h2>
            </div>

            {/* Chat Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-hidden bg-gray-50">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-4 p-4">
                  {selectedChatMessages.map((message, index) => (
                    <div
                      key={message.id || `message-${index}-${new Date(message.timestamp).getTime()}`}
                      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isAdmin ? (
                        <div className="flex items-start gap-2 max-w-[80%]">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2E2E2E] text-white">
                            <Bot size={16} />
                          </div>
                          <div className="rounded-xl p-3 text-sm bg-white border shadow-sm rounded-tl-none">
                            {message.imageUrls && message.imageUrls.length > 0 && (
                              <div className={`mb-2 ${message.imageUrls.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-2'}`}>
                                {message.imageUrls.map((url, index) => {
                                  const isSingleImage = message.imageUrls?.length === 1;
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
                            <p className="break-words">{message.message || message.text}</p>
                            <div className="text-[10px] mt-1 text-gray-500 text-right">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[80%] rounded-xl p-3 text-sm bg-primary text-white shadow-sm rounded-br-none">
                          {message.imageUrls && message.imageUrls.length > 0 && (
                            <div className={`mb-2 ${message.imageUrls.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-2'}`}>
                              {message.imageUrls.map((url, index) => {
                                const isSingleImage = message.imageUrls?.length === 1;
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
                          <p className="break-words">{message.message || message.text}</p>
                          <div className="text-[10px] mt-1 text-white/70 text-right">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* This empty div is used as a reference for scrolling to the bottom */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Reply input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-1 border border-gray-200 shadow-inner">
                  <ChatImageUpload
                    ref={imageUploadRef}
                    onImageUpload={(urls) => setImageUrls(urls)}
                    disabled={!selectedChat}
                  />
                  <Input
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                  />
                </div>
                <Button 
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() && imageUrls.length === 0}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bot size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No conversation selected</h3>
            <p className="text-center max-w-md">
              Select a conversation from the list to view messages and reply to your guests.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
