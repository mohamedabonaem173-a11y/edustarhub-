import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function StudentBuddy() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const [buddyName, setBuddyName] = useState(null);
  const [buddyAvatar, setBuddyAvatar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchBuddySetup = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.replace('/student/buddy-setup');

        const { data, error } = await supabase
          .from('profiles')
          .select('buddy_name, buddy_avatar')
          .eq('id', user.id)
          .single();

        if (error || !data.buddy_name) return router.replace('/student/buddy-setup');

        setBuddyName(data.buddy_name);
        setBuddyAvatar(data.buddy_avatar);

        setMessages([{
          text: `Hello! I'm ${data.buddy_name}. I'm here to help you study. What's on your mind?`,
          sender: 'buddy',
          avatar: data.buddy_avatar
        }]);
      } catch (err) {
        console.error(err);
        router.replace('/student/buddy-setup');
      } finally {
        setLoading(false);
      }
    };

    fetchBuddySetup();
  }, [router]);

  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !buddyName) return;

    const userMessage = { text: input, sender: 'user', avatar: '🧑‍🎓' };
    const currentMessages = [...messages]; 
    setMessages(prev => [...prev, userMessage]);

    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const conversationHistory = currentMessages.slice(1);
    const historyForAPI = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));
    historyForAPI.push({
      role: 'user',
      parts: [{ text: currentInput }],
    });

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: historyForAPI, buddyName })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gemini API Error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.text, sender: 'buddy', avatar: buddyAvatar }]);

    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { text: "Oops! I ran into a technical glitch. Please try again.", sender: 'buddy', avatar: buddyAvatar }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading || !buddyName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <p className="text-cyan-400 text-xl animate-pulse">Connecting to your personalized companion...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar userRole="Student" />
      <div className="max-w-7xl mx-auto flex pt-4 gap-6">
        <Sidebar role="student" />
        <main className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <h1 className="text-4xl font-extrabold text-cyan-400 flex items-center gap-3">
              <span className="text-3xl">{buddyAvatar}</span> {buddyName} - Study Buddy
            </h1>
          </div>

          <div className="flex-1 bg-black/20 shadow-[0_0_20px_cyan] rounded-2xl flex flex-col overflow-hidden">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="text-3xl p-2">{msg.avatar}</div>
                    <div className={`p-4 rounded-3xl text-sm shadow-md ${msg.sender === 'user' ? 'bg-cyan-500 text-black hover:shadow-[0_0_15px_cyan] transition' : 'bg-gray-900 text-cyan-400 shadow-inner'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end max-w-md animate-pulse">
                    <div className="text-3xl p-2">{buddyAvatar}</div>
                    <div className="p-4 rounded-3xl text-sm bg-gray-900 text-cyan-400 shadow-inner">
                      Typing...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex gap-2 bg-black/30">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your Buddy..."
                className="flex-1 p-3 border border-gray-700 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="px-6 py-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 shadow-lg transition"
              >
                Send
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Neon particle background for techy feel */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-pulse"
            style={{
              width: `${Math.random()*4 + 1}px`,
              height: `${Math.random()*4 + 1}px`,
              backgroundColor: `rgba(0,255,255,${Math.random()*0.4})`,
              top: `${Math.random()*100}%`,
              left: `${Math.random()*100}%`,
              animationDelay: `${Math.random()*5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
