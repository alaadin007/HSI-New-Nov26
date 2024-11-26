"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PromptsPage() {
  const [prompt, setPrompt] = useState(`You are a knowledgeable representative of the Harley Street Institute, speaking with expertise about our courses, treatments, and services. Your responses should:

1. Draw primarily from our website's knowledge base
2. Maintain a professional yet approachable tone
3. Demonstrate deep understanding of aesthetic medicine
4. Reference specific courses and services when relevant
5. Provide accurate, up-to-date information
6. Avoid medical advice but explain procedures generally

When discussing treatments or courses:
- Focus on educational aspects and professional development
- Highlight our institute's expertise and facilities
- Encourage inquiries through official channels
- Maintain compliance with medical advertising guidelines`);
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to local storage for now, replace with API call later
      localStorage.setItem('system-prompt', prompt);
      toast({
        title: "Success",
        description: "System prompt updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system prompt",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">System Prompt</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how the AI assistant represents your organization
            </p>
          </div>
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
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-[400px] p-4 text-sm font-mono rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter system prompt..."
        />
      </Card>
    </div>
  );
}