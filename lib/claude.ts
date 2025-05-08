export const generateSentenceWithClaude = async (finnish: string, english: string): Promise<string> => {
  if (!finnish || !english) {
    throw new Error('Both finnish and english words are required');
  }

  try {
    console.log('Sending request to Claude API...', { finnish, english });
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        finnish: finnish.trim(),
        english: english.trim()
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || `API request failed: ${response.status} ${response.statusText}`);
    }

    console.log('Received response from Claude API');
    
    if (!data.text) {
      console.error('No sentence generated in response:', data);
      throw new Error('No sentence generated in the response');
    }

    return data.text;
  } catch (error) {
    console.error('Failed to generate sentence:', error);
    throw error;
  }
}; 