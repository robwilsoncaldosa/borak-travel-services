'use client';

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useMemo } from "react";
import { Bot, Send } from "lucide-react";
import { chatApi, ChatMessage } from "@/lib/backend_api/chat";

import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function InboxPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');



  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:8081');
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
    const interval = setInterval(loadMessages, 1000); 
    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    socket.on('message', (newMessage: ChatMessage) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        return updatedMessages.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
    });

    return () => {
      socket.off('message');
    };
  }, []);


  
  
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedChat) return;

    try {
      const newMessage = await chatApi.sendReply(selectedChat, replyMessage);

      const adminMessage: ChatMessage = {
        ...newMessage,
        userId: selectedChat,
        message: replyMessage,
        text: replyMessage,
        isAdmin: true,
        timestamp: new Date(),
        username: 'Admin',
        sender: 'bot',
        isRead: true
      };

      setMessages(prevMessages =>
        [...prevMessages, adminMessage].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      );

      // Emit the new admin message to all clients (real-time)
      socket.emit('sendMessage', adminMessage);

      setReplyMessage('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };


  const scrollRef = useRef<HTMLDivElement | null>(null);


const selectedChatMessages = useMemo(() => 
  selectedChat
    ? messages
        .filter(m => m.userId === selectedChat)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [],
  [selectedChat, messages]
);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChatMessages]);


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

// const messagesEndRef = useRef<HTMLDivElement>(null);


// useEffect(() => {
//   scrollToBottom();
// }, [messages]);


// const scrollToBottom = () => {
//   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// };


  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 overflow-hidden">
      {/* Chat List */}
      <Card className="w-1/3 flex flex-col min-h-0">
        <div className="p-4 flex-shrink-0">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="flex-1 min-h-0">
        <ScrollArea className="h-full max-h-full">
        {latestMessages.map((chat, index) => {
 const recipientUsername =messages.find(m => m.userId === chat.userId && !m.isAdmin)?.username || 'Guest';
// This is correct now
  const isLastMessageFromAdmin = chat.isAdmin;

  return (
    <div
      key={chat.id || `chat-${index}-${chat.timestamp}`}
      className={`p-4 cursor-pointer rounded-lg mb-2 ${
        selectedChat === chat.userId
          ? 'bg-primary/10'
          : 'hover:bg-muted'
      } ${!chat.isRead ? 'border-l-4 border-primary' : ''} ${
        isLastMessageFromAdmin ? 'bg-blue-50' : 'bg-green-50'
      }`}
      onClick={() => setSelectedChat(chat.userId ?? null)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className={`font-medium ${
                chat.isRead ? 'text-gray-600' : 'text-gray-900'
              }`}
            >
              {chat.isAdmin
                ? `You to ${recipientUsername || 'Guest'}`
                : `${recipientUsername || 'Guest'} to You`}
            </h3>
            {!chat.isRead && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            {new Date(chat.timestamp).toLocaleString()}
          </span>
          <p className="text-sm text-muted-foreground truncate">
            {chat.message || chat.text || 'No message content'}
          </p>
        </div>
      </div>
    </div>
  );
})}


        </ScrollArea>
        </div>
      </Card>

      {/* Chat Details with Reply */}
      <Card className="flex-1 flex flex-col min-h-0">
  {selectedChat ? (
    <>
      {/* Header */}
      <div className="p-4 border-b">
      <h2 className="text-xl font-semibold">
  Chat with {messages.find(m => m.userId === selectedChat)?.guestUsername || 'Guest'}
</h2>


      </div>

      {/* Chat Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">

            {selectedChatMessages.map((message, index) => (
              <div
                key={message.id || `message-${index}-${new Date(message.timestamp).getTime()}`}
                className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isAdmin ? (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2E2E2E] text-white">
                      <Bot size={16} />
                    </div>
                    <div className="max-w-xs md:max-w-sm rounded-xl p-3 text-sm bg-white border shadow-sm">
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
                  <div className="max-w-xs md:max-w-sm rounded-xl p-3 text-sm bg-primary text-white shadow-sm rounded-bl-none">
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
          </div>
        </ScrollArea>
      </div>

      {/* Reply input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
          />
          <Button onClick={handleSendReply}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  ) : (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      Select a conversation to view messages
    </div>
  )}
</Card>

    </div>
  );
}
