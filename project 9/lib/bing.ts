import { z } from 'zod';

const SearchResultSchema = z.object({
  webPages: z.object({
    value: z.array(z.object({
      name: z.string(),
      url: z.string(),
      snippet: z.string(),
      datePublished: z.string().optional(),
    }))
  }).optional()
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

interface SearchOptions {
  freshness?: 'Day' | 'Week' | 'Month';
  count?: number;
  newsCategory?: string;
}

export async function searchBing(query: string, options: SearchOptions = {}): Promise<SearchResult> {
  const apiKey = process.env.BING_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Bing API Key');
  }

  const searchParams = new URLSearchParams({
    q: query,
    count: options.count?.toString() || '50',
    ...(options.freshness && { freshness: options.freshness }),
    ...(options.newsCategory && { category: options.newsCategory }),
  });

  const response = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?${searchParams.toString()}`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Bing search failed');
  }

  const data = await response.json();
  return SearchResultSchema.parse(data);
}