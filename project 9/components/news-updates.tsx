"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  title: string;
  url: string;
  snippet: string;
  insight: string;
  date: string;
}

export function NewsUpdates() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setNews(data.news);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news updates. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {news.map((item, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden hover:bg-muted/50 transition-colors duration-300"
                  >
                    <motion.div
                      initial={false}
                      animate={{ height: selectedArticle?.url === item.url ? 'auto' : '140px' }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="shrink-0"
                          >
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.snippet}
                        </p>

                        {selectedArticle?.url === item.url && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <h4 className="text-sm font-medium mb-2">Expert Insight:</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.insight}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    <Button
                      variant="ghost"
                      className="absolute bottom-2 right-2"
                      onClick={() => setSelectedArticle(
                        selectedArticle?.url === item.url ? null : item
                      )}
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          selectedArticle?.url === item.url ? 'rotate-90' : ''
                        }`}
                      />
                    </Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}