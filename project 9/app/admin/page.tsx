"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/error-boundary";

const SITES = [
  {
    id: '1',
    name: 'Harley Street Institute',
    domain: 'https://www.harleystreetinstitute.com'
  },
  {
    id: '2',
    name: 'The Harley Street',
    domain: 'https://www.theharleystreet.com'
  }
];

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, string[]>>({});
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const scrapeWebsite = async (site: typeof SITES[0]) => {
    setIsLoading(prev => ({ ...prev, [site.id]: true }));
    setProgress(prev => ({ ...prev, [site.id]: [`Starting content scraping for ${site.domain}...`] }));
    
    try {
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: site.domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setProgress(prev => ({
        ...prev,
        [site.id]: [
          ...prev[site.id],
          `Successfully processed ${data.pageCount} pages from ${site.domain}`,
          "Content has been stored and is ready for use",
        ],
      }));
      
      toast({
        title: "Success",
        description: `Successfully scraped content from ${site.domain}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Scraping error:', error);
      
      setProgress(prev => ({
        ...prev,
        [site.id]: [...prev[site.id], `Error: ${errorMessage}`],
      }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [site.id]: false }));
    }
  };

  const toggleExpanded = (siteId: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto max-w-4xl p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="space-y-4">
            {SITES.map((site) => (
              <Card key={site.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{site.name}</h2>
                    <p className="text-sm text-muted-foreground">{site.domain}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleExpanded(site.id)}
                    >
                      {isExpanded[site.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => scrapeWebsite(site)}
                      disabled={isLoading[site.id]}
                    >
                      {isLoading[site.id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Scrape Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded[site.id] && progress[site.id]?.length > 0 && (
                  <Card className="bg-muted p-4 mt-4">
                    <h3 className="font-semibold mb-2">Progress Log</h3>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {progress[site.id].map((message, index) => (
                          <p key={index} className="text-sm">
                            {message}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
                )}
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
}