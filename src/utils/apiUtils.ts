
export const GROQ_API_KEY = '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';
export const ELEVEN_LABS_API_KEY = 'sk_0a698d0fe41e151a6beb111e56e8c33e47b779c45349290c';

// For text-based problems
export async function solveWithGroq(problem: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a math problem solver. Provide step-by-step solutions to mathematical problems in clear, detailed format.'
          },
          {
            role: 'user',
            content: problem
          }
        ],
        temperature: 0.5,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error solving problem with Groq:', error);
    return 'Sorry, I encountered an error while solving this problem.';
  }
}

// For image-based problems using vision API
export async function solveWithGroqVision(imageBase64: string): Promise<string> {
  try {
    // Use meta-llama/llama-4-scout-17b-16e-instruct model for vision tasks
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Updated to use llama-4-scout model with vision capability
        messages: [
          {
            role: 'system',
            content: 'You are a math problem solver. Analyze the image and provide a step-by-step solution to the mathematical problem shown.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Solve this math problem:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.5,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    
    // Improved error handling with detailed logging
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response format:', JSON.stringify(data));
      throw new Error('Invalid response format from Groq API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error solving problem with Groq Vision:', error);
    return 'Sorry, I encountered an error while processing this image. The vision model might not be available or the image format is not supported.';
  }
}

// For audio-based problems (first convert speech to text)
export async function convertSpeechToText(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model_id', 'scribe_v1');
    formData.append('tag_audio_events', 'true');
    formData.append('language_code', 'eng');
    formData.append('diarize', 'true');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs API error:', errorData);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the transcription text from the response
    if (data.text) {
      return data.text;
    } else if (data.transcription) {
      return data.transcription;
    } else {
      console.error('Unexpected response format:', data);
      return '';
    }
  } catch (error) {
    console.error('Error converting speech to text:', error);
    return '';
  }
}
