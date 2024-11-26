import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { searchBing } from '@/lib/bing';
import { openai } from '@/lib/openai';
import { blogStore } from '@/lib/blog';

function generatePostTimes(count: number): Date[] {
  const now = new Date();
  const sunset = new Date(now);
  sunset.setHours(18, 0, 0, 0); // Approximate sunset time

  const times: Date[] = [];
  const timeRange = sunset.getTime() - now.getTime();
  
  for (let i = 0; i < count; i++) {
    const randomTime = new Date(now.getTime() + Math.random() * timeRange);
    times.push(randomTime);
  }

  return times.sort((a, b) => a.getTime() - b.getTime());
}

export async function POST(request: Request) {
  try {
    const { postsPerDay } = await request.json();
    const postTimes = generatePostTimes(postsPerDay);

    // Get news content
    const newsResults = await searchBing('aesthetic medicine news', {
      freshness: 'Day',
      count: postsPerDay,
    });

    if (!newsResults.webPages?.value) {
      throw new Error('No news articles found');
    }

    // Process and schedule each post
    const scheduledPosts = await Promise.all(
      newsResults.webPages.value.map(async (article, index) => {
        const content = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Generate an engaging blog post about this aesthetic medicine news article. Focus on the educational and scientific aspects.'
            },
            {
              role: 'user',
              content: `Title: ${article.name}\n\nContent: ${article.snippet}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const post = {
          title: article.name,
          content: content.choices[0]?.message?.content || '',
          summary: article.snippet,
          category: 'news',
          tags: ['aesthetic-medicine', 'industry-news'],
          author: 'AI Editor',
          publishedAt: postTimes[index].toISOString(),
          status: 'published',
          slug: article.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        };

        // Store the scheduled post
        await blogStore.createPost(post);

        return {
          ...post,
          scheduledTime: postTimes[index],
        };
      })
    );

    return NextResponse.json({
      success: true,
      scheduledPosts: scheduledPosts.map(post => ({
        title: post.title,
        scheduledTime: post.scheduledTime,
      })),
    });
  } catch (error) {
    console.error('Failed to schedule news posts:', error);
    return NextResponse.json(
      { error: 'Failed to schedule news posts' },
      { status: 500 }
    );
  }
}