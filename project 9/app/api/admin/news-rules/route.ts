import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { z } from 'zod';

const NewsRulesSchema = z.object({
  rules: z.string(),
  autoPostsPerDay: z.number().min(1).max(20)
});

export async function GET() {
  try {
    const rules = await kv.get('news:rules');
    const autoPostsPerDay = await kv.get('news:autoPostsPerDay') || 5;
    return NextResponse.json({ rules, autoPostsPerDay });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news rules' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rules, autoPostsPerDay } = NewsRulesSchema.parse(data);

    await kv.set('news:rules', rules);
    await kv.set('news:autoPostsPerDay', autoPostsPerDay);

    // Schedule the auto-posting job
    await fetch('/api/news/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postsPerDay: autoPostsPerDay }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save news rules:', error);
    return NextResponse.json(
      { error: 'Failed to save news rules' },
      { status: 500 }
    );
  }
}