import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSentenceWithClaude(finnish: string, english: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Generate a simple example sentence in Finnish using the word "${finnish}" (which means "${english}"). The sentence should be simple enough for a beginner to understand. Include the English translation. Format the response as:

Finnish: [sentence]
English: [translation]`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    throw new Error('Unexpected response type from Claude');
  } catch (error) {
    console.error('Error generating sentence with Claude:', error);
    throw error;
  }
} 