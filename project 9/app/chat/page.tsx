"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useChat } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: initialQuery ? [
      { id: 'initial-query', role: 'user', content: initialQuery }
    ] : [],
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 transition-all duration-500 animate-in fade-in">
      <div className="fixed inset-4 md:inset-8 lg:inset-12 transition-all duration-500 animate-in slide-in-from-bottom-4">
        <Card className="h-full flex flex-col shadow-lg border bg-background/95 rounded-2xl overflow-hidden">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <h1 className="text-lg font-medium">AI Assistant</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/')}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary/90 text-primary-foreground ml-4'
                        : 'bg-muted/50 mr-4'
                    } animate-in slide-in-from-bottom-1`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-xl px-4 py-2 mr-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-background/95">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 h-11 px-4 rounded-xl border bg-background/50 
                         focus:outline-none focus:ring-1 focus:ring-primary/20 
                         transition-all duration-200"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-xl h-11 w-11 bg-primary/90 hover:bg-primary"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}