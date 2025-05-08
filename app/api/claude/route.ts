import { NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set in environment variables');
}

const anthropic = new Anthropic({
  apiKey: apiKey,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    if (!body.finnish || !body.english) {
      console.error('Missing required fields:', body);
      return NextResponse.json(
        { error: 'Missing required fields: finnish and english are required' },
        { status: 400 }
      );
    }

    const { finnish, english } = body;

    const prompt = `Create a simple Finnish sentence using the word "${finnish}" (meaning "${english}"). 
The sentence should be:
- Beginner level
- Use basic vocabulary
- Be grammatically correct
- Include a translation in English

Format the response as:
Finnish: [sentence]
English: [translation]`;

    console.log('Sending request to Anthropic API with prompt:', prompt);

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      system: "You are a helpful assistant that creates simple Finnish sentences for language learners.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    console.log('Received response from Anthropic API:', JSON.stringify(message, null, 2));
    
    const contentBlock = message.content[0];
    if (!contentBlock || contentBlock.type !== 'text') {
      console.error('Invalid response format:', message);
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

    const generatedText = contentBlock.text.trim();
    console.log('Generated text:', generatedText);
    
    if (!generatedText) {
      console.error('No sentence generated in response:', message);
      return NextResponse.json(
        { error: 'No sentence generated in the response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('Failed to generate sentence:', error);
    return NextResponse.json(
      { error: 'Failed to generate sentence', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 