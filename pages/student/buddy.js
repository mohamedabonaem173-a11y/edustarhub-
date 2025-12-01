// pages/student/buddy.js (FINAL WITH GEMINI INTEGRATION)

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar'; // <-- Import Sidebar
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'; 

// 🛑 NEW: Import the Google Gen AI SDK
import { GoogleGenAI } from "@google/genai";

// --- Supabase Configuration (HARDCODED) ---
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ---

// 🛑 NEW: Gemini Configuration
// !!! REPLACE "YOUR_GEMINI_API_KEY_HERE" WITH YOUR ACTUAL KEY !!!
const GEMINI_API_KEY = "AIzaSyDT471LEfhC0yr226wP-tLBLi3WCxRJQSU"; 
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const modelName = 'gemini-2.5-flash';

// 🛑 NEW: Define the Buddy's Personality and Role (Crucial for context and slang)
const BUDDY_SYSTEM_INSTRUCTION = (buddyName) => 
`You are ${buddyName}, a friendly, supportive, and highly knowledgeable Study and Stress Buddy for high school students. 
Your primary roles are: 
1. **Academic Help:** Answer subject questions clearly and break down complex concepts.
2. **Stress Management:** Offer empathy, encouragement, and practical, positive stress-reduction tips.
3. **Teen Communication:** You understand and use common teenage slang (like 'wbu', 'idk', 'fr', 'bet') naturally, but maintain a respectful and helpful tone. Acknowledge greetings and keep the conversation flowing.
4. **Context:** Keep responses concise and relevant to the student's question, aiming for short, helpful chats.`;


export default function StudentBuddy() {
    const router = useRouter();
    const [buddyName, setBuddyName] = useState(null); 
    const [buddyAvatar, setBuddyAvatar] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🛑 NEW: State for the Gemini Chat Session
    const [chatSession, setChatSession] = useState(null);

    // EFFECT: Fetch customization from Supabase and initialize chat
    useEffect(() => {
        const fetchBuddySetup = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.replace('/student/buddy-setup');
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('buddy_name, buddy_avatar')
                    .eq('id', user.id)
                    .single();

                if (error || !data.buddy_name) {
                    router.replace('/student/buddy-setup');
                    return;
                }
                
                const name = data.buddy_name;
                const avatar = data.buddy_avatar;
                
                setBuddyName(name);
                setBuddyAvatar(avatar);

                // 🛑 NEW: Initialize the Gemini Chat Session with System Instructions
                const newChat = ai.chats.create({
                    model: modelName,
                    config: {
                        systemInstruction: BUDDY_SYSTEM_INSTRUCTION(name),
                    },
                });
                setChatSession(newChat);

                // Initialize chat history with the Buddy's first message
                setMessages([{ 
                    text: `Hello! I'm ${name}. I'm here to help you study and manage any stress you might be feeling. What's on your mind?`, 
                    sender: 'buddy', 
                    avatar: avatar
                }]);
                
            } catch (err) {
                console.error("Error fetching buddy setup or initializing Gemini:", err);
                // Fallback to setup if any error occurs
                router.replace('/student/buddy-setup');
            } finally {
                setLoading(false);
            }
        };

        fetchBuddySetup();
    }, [router]);
    
    // 🛑 UPDATED: handleSendMessage now uses the Gemini API
    const handleSendMessage = async (e) => {
        e.preventDefault();
        // Check for input, typing status, and if the chat session is ready
        if (!input.trim() || isTyping || !buddyName || !chatSession) return; 

        const userMessage = { text: input, sender: 'user', avatar: '🧑‍🎓' };
        
        // Optimistically update the UI with the user's message
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // 🛑 GEMINI API CALL 🛑
            const response = await chatSession.sendMessage({ message: currentInput });
            
            const buddyResponseText = response.text.trim();
            
            const buddyResponse = { 
                text: buddyResponseText, 
                sender: 'buddy', 
                avatar: buddyAvatar 
            };
            
            setMessages(prev => [...prev, buddyResponse]);

        } catch (error) {
            console.error("Gemini API Error:", error);
            // Inform the user about the error
            const errorResponse = {
                text: "Oops! I ran into a technical glitch. Please make sure you have installed the @google/genai package and your API key is correct. Could you try asking that again?",
                sender: 'buddy',
                avatar: buddyAvatar
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };


    if (loading || !buddyName || !chatSession) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-violet-600">Connecting to your personalized companion...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Student" />
            
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role="student" /> 
                
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8 border-b pb-2">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            {buddyAvatar} {buddyName} - Study & Stress Buddy
                        </h1>
                    </div>

                    {/* Chat Window */}
                    <div className="bg-white shadow-xl rounded-xl flex flex-col h-[80vh]">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-end max-w-xs md:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* Avatar (Buddy's custom avatar or student emoji) */}
                                        <div className={`text-2xl p-2 ${msg.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                                            {msg.avatar}
                                        </div>

                                        {/* Bubble */}
                                        <div 
                                            className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap shadow ${
                                                msg.sender === 'user' 
                                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-end max-w-md">
                                        <div className="text-2xl p-2 mr-2">{buddyAvatar}</div>
                                        <div className="p-4 rounded-3xl text-sm bg-gray-200 text-gray-800 rounded-tl-none">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your Buddy about stress or your school work..."
                                className="flex-1 p-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-r-xl hover:bg-violet-700 transition disabled:bg-gray-400"
                            >
                                Send
                            </button>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}