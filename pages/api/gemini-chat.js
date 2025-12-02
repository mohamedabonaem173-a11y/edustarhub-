import { GoogleGenAI } from "@google/genai";

// 🔒 CRITICAL: Reads the private environment variable. This file only runs on the server!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY_PRIVATE; 

// Initialize AI Client
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const modelName = 'gemini-2.5-flash';

// Define the Buddy's Personality and Role on the server-side
const BUDDY_SYSTEM_INSTRUCTION = (buddyName) => 
`You are ${buddyName}, a friendly, supportive, and highly knowledgeable Study and Stress Buddy... (rest of your system instruction)`;


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!ai) {
        return res.status(503).json({ error: 'AI Service Not Configured' });
    }

    const { message, buddyName } = req.body;

    if (!message || !buddyName) {
        return res.status(400).json({ error: 'Missing message or buddyName' });
    }

    try {
        // Create a *new* chat session for each request (you would need history management for a real chat)
        // For simplicity here, we'll use generateContent with the system instruction
        const response = await ai.models.generateContent({
            model: modelName,
            contents: message,
            config: {
                 systemInstruction: BUDDY_SYSTEM_INSTRUCTION(buddyName)
            }
        });

        // Send the AI response back to the client
        res.status(200).json({ text: response.text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Do NOT expose the full error to the client.
        res.status(500).json({ error: 'Internal AI service error.' });
    }
}