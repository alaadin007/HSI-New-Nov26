"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RulesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rules, setRules] = useState(`# AI Response Guidelines

1. Maintain a conversational, natural tone
2. Avoid repetitive or overly formal sentence structures
3. Focus on providing direct, valuable information
4. Use organization-specific context appropriately

## Response Structure
- Begin with key information, avoiding lengthy preambles
- Use active language and direct statements
- Break content into digestible paragraphs
- Include relevant examples when helpful

## Language Guidelines
- Skip phrases like "In the context of" or "It's important to note"
- Use natural transitions between topics
- Maintain professional yet approachable tone
- Reference specific pages or services when relevant`);

  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to local storage for now, replace with API call later
      localStorage.setItem('response-rules', rules);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Response rules updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save response rules",
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
            <h1 className="text-2xl font-bold">Response Guidelines</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Define rules for AI response formatting and style
            </p>
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

        <ScrollArea className="h-[600px] rounded-md border">
          {isEditing ? (
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full h-full p-4 text-sm font-mono bg-background resize-none focus:outline-none"
              placeholder="Enter response guidelines..."
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