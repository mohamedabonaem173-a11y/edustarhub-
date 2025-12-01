// pages/api/generate-quiz.js

import { GoogleGenAI } from '@google/genai';

// --- HARDCODED GEMINI API KEY ---
// 🛑 WARNING: Replace this placeholder with your actual Gemini API Key.
const GEMINI_API_KEY = "AIzaSyDT471LEfhC0yr226wP-tLBLi3WCxRJQSU"; 
// ------------------------------------

// Initialize the Google GenAI client using the hardcoded key
const ai = new GoogleGenAI(GEMINI_API_KEY);

// Define the expected JSON schema for the AI response
const QUIZ_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A short, engaging title for the quiz based on the topic."
    },
    questions: {
      type: "array",
      description: "A list of quiz questions.",
      items: {
        type: "object",
        properties: {
          question_text: {
            type: "string",
            description: "The main text of the question."
          },
          type: {
            type: "string",
            description: "The type of question. Always 'multiple-choice' for this model."
          },
          options: {
            type: "array",
            items: { type: "string" },
            description: "Exactly four possible answers."
          },
          correct_answer: {
            type: "string",
            description: "The exact text of the correct option from the options array."
          },
          explanation: {
            type: "string",
            description: "A brief explanation for why the answer is correct."
          }
        },
        required: ["question_text", "type", "options", "correct_answer", "explanation"]
      }
    }
  },
  required: ["title", "questions"]
};


export default async function handler(req, res) {
  // Check for POST request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, count } = req.body;

  // Basic validation
  if (!topic || !count || count <= 0 || !GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    // Return a clearer error message if the key is missing or topic is invalid
    return res.status(400).json({ 
      error: `Missing topic, number of questions, or API Key is not set in API file.` 
    });
  }

  try {
    const prompt = `Generate a multiple-choice quiz about the topic: "${topic}". The quiz must contain exactly ${count} questions. For each question, provide 4 distinct options, clearly specify the correct_answer, and include a brief explanation. Ensure the output strictly follows the provided JSON schema.`;
    
    // Call the Gemini API with strict JSON mode
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: QUIZ_JSON_SCHEMA,
            // You can add more safety settings if needed
        }
    });

    // The response text will be a JSON string conforming to the schema
    const jsonString = response.text.trim();
    const quizData = JSON.parse(jsonString);

    // Success: send the clean JSON data back to the frontend
    return res.status(200).json(quizData);

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Failure: send an error response as JSON
    return res.status(500).json({ 
      error: `Failed to generate quiz due to an external error (AI or JSON parsing). Details: ${error.message}` 
    });
  }
}