import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar'; 
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'; 

// 🛑 IMPORTANT: The Gemini SDK import is removed because the AI logic moved to the API route.

// --- Supabase Configuration (HARDCODED) ---
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ---

// 🛑 All API Key usage has been removed from this client-side file.


export default function StudentBuddy() {
    const router = useRouter();
    const messagesEndRef = useRef(null); 
    const [buddyName, setBuddyName] = useState(null); 
    const [buddyAvatar, setBuddyAvatar] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    // Scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // EFFECT: Initialize chat and fetch buddy setup
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

                // 🛑 Chat Session Initialization is REMOVED. The serverless function handles the AI logic.

                // Initialize chat history with the Buddy's first message
                setMessages([{ 
                    text: `Hello! I'm ${name}. I'm here to help you study and manage any stress you might be feeling. What's on your mind?`, 
                    sender: 'buddy', 
                    avatar: avatar
                }]);
                
            } catch (err) {
                console.error("Error fetching buddy setup:", err);
                // Fallback to setup if any error occurs
                router.replace('/student/buddy-setup');
            } finally {
                setLoading(false);
            }
        };

        fetchBuddySetup();
    }, [router]);
    
    // EFFECT: Scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // ✅ UPDATED: handleSendMessage now calls the secure Next.js API Route
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        // Basic checks for input and state
        if (!input.trim() || isTyping || !buddyName) { 
           return;
        } 

        const userMessage = { text: input, sender: 'user', avatar: '🧑‍🎓' };
        
        // Optimistically update the UI with the user's message
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // 🚀 CALL YOUR SECURE NEXT.JS API ROUTE 🚀
            const response = await fetch('/api/gemini-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send the message and the buddy's name for system instruction setup on the server
                body: JSON.stringify({ message: currentInput, buddyName: buddyName }),
            });
            
            if (!response.ok) {
                // Read the error message from the serverless function
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            const buddyResponseText = data.text.trim();
            
            const buddyResponse = { 
                text: buddyResponseText, 
                sender: 'buddy', 
                avatar: buddyAvatar 
            };
            
            setMessages(prev => [...prev, buddyResponse]);

        } catch (error) {
            console.error("API Call Error:", error);
            // Inform the user about the error with the custom message
            const errorResponse = {
                text: "Oops! I ran into a technical glitch. The AI service couldn't respond. Please check the console for details, or try asking that again.",
                sender: 'buddy',
                avatar: buddyAvatar
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };


    if (loading || !buddyName) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-xl text-violet-600 dark:text-violet-400">Connecting to your personalized companion...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar userRole="Student" />
            
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role="student" /> 
                
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8 border-b pb-2">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                            {buddyAvatar} {buddyName} - Study & Stress Buddy
                        </h1>
                    </div>

                    {/* Chat Window */}
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl flex flex-col h-[80vh]">
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
                                                    // Dark mode bubble styling
                                                    : 'bg-gray-200 text-gray-800 rounded-tl-none dark:bg-gray-700 dark:text-gray-200'
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
                                        <div className="p-4 rounded-3xl text-sm bg-gray-200 text-gray-800 rounded-tl-none dark:bg-gray-700 dark:text-gray-200">
                                            <div className="flex space-x-1">
                                                {/* Typing indicator dots */}
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} /> {/* Auto-scroll target */}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your Buddy about stress or your school work..."
                                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
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