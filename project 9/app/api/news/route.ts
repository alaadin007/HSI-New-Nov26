import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { searchBing } from '@/lib/bing';
import { kv } from '@/lib/kv';

const APPROVED_DOMAINS = [
  'aestheticmed.co.uk',
  'en.anti-age-magazine.com'
];

export async function GET() {
  try {
    // Get news rules
    const rules = await kv.get('news:rules');

    // Fetch news from approved sources
    const newsPromises = APPROVED_DOMAINS.map(domain =>
      searchBing(`site:${domain}`, {
        freshness: 'Month',
        count: 15,
        newsCategory: 'Health'
      })
    );

    const newsResults = await Promise.all(newsPromises);
    const allArticles = newsResults.flatMap(result => 
      result.webPages?.value || []
    ).filter(article => 
      // Filter out articles mentioning competitors or courses
      !article.snippet.toLowerCase().includes('course') &&
      !article.snippet.toLowerCase().includes('training provider')
    );

    // Generate AI summaries and insights
    const newsWithInsights = await Promise.all(
      allArticles.slice(0, 15).map(async (article) => {
        const insight = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `Analyze this aesthetic medicine news article and provide key insights. Focus on scientific and medical aspects. Exclude any mentions of training providers or courses.

Rules:
${rules || 'Focus on industry news, research, and developments.'}`
            },
            {
              role: 'user',
              content: `Title: ${article.name}\n\nContent: ${article.snippet}`
            }
          ],
          temperature: 0.7,
          max_tokens: 250
        });

        return {
          title: article.name,
          url: article.url,
          snippet: article.snippet,
          insight: insight.choices[0]?.message?.content || '',
          date: new Date().toISOString(),
          source: new URL(article.url).hostname
        };
      })
    );

    return NextResponse.json({
      success: true,
      news: newsWithInsights
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news updates' },
      { status: 500 }
    );
  }
}