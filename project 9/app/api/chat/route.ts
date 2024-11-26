import { OpenAIStream, StreamingTextResponse } from 'ai';
import { openai } from '@/lib/openai';
import { searchBing } from '@/lib/bing';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Get context from Bing search
    let searchContext = '';
    try {
      const results = await searchBing(lastMessage.content);
      if (results.webPages?.value) {
        searchContext = results.webPages.value
          .slice(0, 3)
          .map(page => `${page.name}\n${page.snippet}`)
          .join('\n\n');
      }
    } catch (error) {
      console.error('Bing search failed:', error);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for the Harley Street Institute, specializing in aesthetic medicine training and education.
          
${searchContext ? `\nContext from relevant sources:\n${searchContext}\n` : ''}

Focus on providing accurate information about:
- Aesthetic medicine courses and certifications
- Clinical procedures and best practices
- Training requirements and qualifications
- Industry regulations and standards

Always be professional and accurate in your responses. If you're not sure about something, say so rather than making assumptions.

When discussing treatments or procedures:
- Emphasize the importance of proper training and certification
- Highlight safety considerations and best practices
- Reference current industry standards and guidelines
- Provide context about required qualifications`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }), 
      { status: 500 }
    );
  }
}