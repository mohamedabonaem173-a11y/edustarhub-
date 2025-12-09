// pages/api/gemini-chat.js

const MODEL_NAME = 'gemini-2.5-flash'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Expecting the full history array from the client
  const { history, buddyName } = req.body; 

  if (!history || !buddyName) {
    return res.status(400).json({ error: 'Missing history or buddyName' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing in environment variables.");
    return res.status(500).json({ error: 'Server configuration error: AI key missing.' });
  }

  // Define the System Instruction / Role
  const systemInstructionText = `You are ${buddyName}, a supportive and patient study buddy for a student. Your goal is to help the student understand complex topics, answer questions, and provide encouragement. Keep your answers concise, helpful, and friendly. Do not reveal that you are an AI or a language model.`;

  // --- FIX: Create the specialized persona setup content ---
  const personaSetup = [
    // 1. User role sets the persona/rules
    { 
        role: 'user', 
        parts: [{ text: systemInstructionText }] 
    },
    // 2. Model role provides a necessary empty response to "prime" the model
    //    and ensure the actual conversation starts with the user's first real query.
    { 
        role: 'model', 
        parts: [{ text: 'Understood. Ready to help.' }] 
    }
  ];
  // --- END FIX ---
  
  // Combine the setup with the actual conversation history
  const contentsWithPersona = [...personaSetup, ...history];

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // REMOVED: systemInstruction top-level field (it caused the error)
        
        generationConfig: {
          maxOutputTokens: 300 
        },
        
        // The contents array includes the persona setup followed by the history
        contents: contentsWithPersona,
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Gemini API returned error:', errData);
      return res.status(response.status).json({ 
        error: errData.error?.message || 'Gemini API Error', 
        details: errData 
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn('Gemini API returned no text in the expected format:', data);
      return res.status(500).json({ text: "Sorry, I couldn't generate a response." });
    }

    res.status(200).json({ text });
  } catch (err) {
    console.error('Gemini API request failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}