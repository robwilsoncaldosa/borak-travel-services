'use client';

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useContext } from "react";
import { Send } from "lucide-react";
import { chatApi, ChatMessage } from "@/lib/backend_api/chat";
import { ChatContext } from "@/lib/chat-context";

export default function InboxPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const { messages: liveMessages } = useContext(ChatContext);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await chatApi.getAllMessages();
        
        const validMessages = data.filter(message => 
          message && (message.message || message.text) && message.userId
        );

        const messagesByUser = validMessages.reduce((acc: { [key: string]: ChatMessage }, message) => {
          const userId = message.userId || '';
          const currentMessage = acc[userId];
          if (!currentMessage || new Date(message.timestamp) > new Date(currentMessage.timestamp)) {
            acc[userId] = message;
          }
          return acc;
        }, {});

        const latestMessages = Object.values(messagesByUser);
        const sortedMessages = latestMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setMessages(sortedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedChat) return;

    try {
      const newMessage = await chatApi.sendReply(selectedChat, replyMessage);
      setReplyMessage('');
      // No need to update chatMessages, liveMessages should reflect changes
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const selectedChatMessages = selectedChat
    ? liveMessages
        .filter((m) => m.userId === selectedChat)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Chat List */}
      <Card className="w-1/3 p-4">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {messages.length > 0 ? (
            messages.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer rounded-lg mb-2 ${
                  selectedChat === chat.userId
                    ? 'bg-primary/10'
                    : 'hover:bg-muted'
                } ${!chat.isRead ? 'font-semibold' : ''}`}
                onClick={() => setSelectedChat(chat.userId ?? null)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{chat.username || 'Guest'}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.message || chat.text || 'No message content'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No messages found
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Chat Details with Reply */}
      <Card className="flex-1 p-4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">
                {messages.find(m => m.userId === selectedChat)?.username}
              </h2>
            </div>
            <ScrollArea className="flex-1 mb-4 pr-2">
  <div className="flex flex-col gap-3">
    {selectedChatMessages.map((message) => (
      <div
        key={message.id || `${message.userId}-${message.timestamp}`}
        className={`flex ${
          message.isAdmin ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={`max-w-xs md:max-w-sm rounded-xl p-3 text-sm shadow-sm ${
            message.isAdmin
              ? 'bg-primary text-white rounded-br-none'
              : 'bg-muted text-foreground rounded-bl-none'
          }`}
        >
          <p className="break-words">{message.message || message.text}</p>
          <div className="text-[10px] mt-1 text-muted-foreground text-right">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    ))}
  </div>
</ScrollArea>

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
