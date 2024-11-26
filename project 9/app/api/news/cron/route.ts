import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { searchBing } from '@/lib/bing';
import { openai } from '@/lib/openai';

// This route can be called by a cron job to update news periodically
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bingNews = await searchBing('aesthetic medicine training OR cosmetic procedures OR aesthetic industry news', {
      freshness: 'Day',
      count: 10,
      newsCategory: 'Health'
    });

    if (!bingNews.webPages?.value?.length) {
      return NextResponse.json({ message: 'No new articles found' });
    }

    const processedNews = await Promise.all(
      bingNews.webPages.value.map(async (article) => {
        const insight = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in aesthetic medicine. Analyze this news article and provide key insights relevant to medical professionals and students in aesthetic medicine.'
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
          date: new Date().toISOString()
        };
      })
    );

    await kv.set('latest-news', processedNews);

    return NextResponse.json({
      success: true,
      message: `Processed ${processedNews.length} news articles`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('News cron error:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}