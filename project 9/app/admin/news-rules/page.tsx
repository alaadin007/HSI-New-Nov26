"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NewsRulesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoPostsPerDay, setAutoPostsPerDay] = useState("5");
  const [rules, setRules] = useState(`# News Sources Configuration

## Approved Sources
- https://aestheticmed.co.uk/
- https://en.anti-age-magazine.com/

## Content Guidelines
1. Only fetch articles from approved sources
2. Exclude any mentions or articles about other aesthetic training providers
3. Focus on industry news, research, and developments
4. Prioritize articles about:
   - New treatments and techniques
   - Industry regulations and standards
   - Scientific research in aesthetics
   - Best practices and safety guidelines

## Content Filters
- Exclude promotional content
- Exclude course advertisements
- Exclude competitor mentions
- Exclude pricing discussions

## Automated Posting Schedule
- Posts are distributed throughout the day before sunset
- Random timing for each post to appear natural
- Maximum posts per day: ${autoPostsPerDay}
- Minimum 30-minute gap between posts

## Content Processing
1. Extract key information from articles
2. Generate AI summaries focusing on educational value
3. Remove any competitive or promotional content
4. Ensure all content aligns with medical advertising guidelines

## Post Generation
1. Use GPT-4 to generate unique, engaging titles
2. Create concise, informative summaries
3. Add relevant hashtags and categories
4. Include source attribution and timestamps`);

  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/news-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          rules,
          autoPostsPerDay: parseInt(autoPostsPerDay)
        }),
      });
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "News rules updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save news rules",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">News Sources & Rules</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure approved news sources and content guidelines
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                Auto-posts per day:
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={autoPostsPerDay}
                onChange={(e) => setAutoPostsPerDay(e.target.value)}
                className="w-20"
              />
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="min-w-[100px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Rules
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-md border">
          {isEditing ? (
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full h-full p-4 text-sm font-mono bg-background resize-none focus:outline-none"
              placeholder="Enter news rules..."
            />
          ) : (
            <div className="p-4 prose prose-sm max-w-none">
              {rules.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h2 key={index} className="text-xl font-bold mt-6 first:mt-0 mb-4">{line.slice(2)}</h2>;
                }
                if (line.startsWith('## ')) {
                  return <h3 key={index} className="text-lg font-semibold mt-6 mb-3">{line.slice(3)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <p key={index} className="ml-4 mb-2">• {line.slice(2)}</p>;
                }
                if (line.match(/^\d+\./)) {
                  return <p key={index} className="ml-4 mb-2">{line}</p>;
                }
                return <p key={index} className="mb-2">{line}</p>;
              })}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}