"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="So, you want to be an aesthetic practioner?"
              className="w-full px-6 py-4 pl-14 pr-20 text-foreground bg-background/90 backdrop-blur-sm 
                       border border-primary/10 rounded-xl focus:border-primary/20 focus:ring-2 
                       focus:ring-primary/10 transition-all duration-300 ease-in-out 
                       shadow-sm placeholder:text-muted-foreground/60"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
            
            <Button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary/90 text-primary-foreground 
                       rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-300 ease-in-out shadow-sm"
            >
              Ask
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}