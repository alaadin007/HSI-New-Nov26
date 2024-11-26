import { NextResponse } from 'next/server';
import { searchBing } from '@/lib/bing';
import { openai } from '@/lib/openai';
import { kv } from '@/lib/kv';
import { z } from 'zod';

const RequestSchema = z.object({
  domain: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain } = RequestSchema.parse(body);
    
    console.log(`Starting scrape for domain: ${domain}`);
    
    // First, try to get content via Bing Search API
    const searchResults = await searchBing(`site:${domain}`);
    
    if (!searchResults.webPages?.value?.length) {
      console.log('No pages found via Bing API');
      throw new Error('No pages found to scrape');
    }

    // Process each page found
    const processedPages = [];
    
    for (const page of searchResults.webPages.value) {
      try {
        console.log(`Processing page: ${page.url}`);
        
        const summary = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Extract key information about aesthetic medicine training and procedures. Focus on courses, qualifications, and training programs.',
            },
            {
              role: 'user',
              content: `Page Title: ${page.name}\n\nContent: ${page.snippet}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        processedPages.push({
          url: page.url,
          title: page.name,
          content: summary.choices[0]?.message?.content || page.snippet,
          lastCrawled: new Date().toISOString()
        });

        // Rate limiting for OpenAI API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing page ${page.url}:`, error);
        // Still include the page with original snippet if OpenAI processing fails
        processedPages.push({
          url: page.url,
          title: page.name,
          content: page.snippet,
          lastCrawled: new Date().toISOString()
        });
      }
    }

    const websiteData = {
      domain,
      pages: processedPages,
      lastUpdated: new Date().toISOString(),
      pageCount: processedPages.length
    };

    await kv.set(`website:${domain}`, websiteData);

    return NextResponse.json({
      success: true,
      pageCount: websiteData.pageCount,
      message: `Successfully processed ${websiteData.pageCount} pages`,
      data: websiteData,
    });
  } catch (error) {
    console.error('Scraping error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }, { 
      status: error instanceof Error && error.message.includes('No pages found') ? 404 : 500 
    });
  }
}