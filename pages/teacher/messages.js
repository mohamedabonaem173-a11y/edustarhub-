// pages/teacher/messages.js
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

export default function TeacherMessages() {
  const role = 'teacher';

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // New state for logged-in user's profile
  const [students, setStudents] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [zoomLink, setZoomLink] = useState('');

  const messagesEndRef = useRef(null); 

  // Fetch current user session and profile
  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
    };
    getUserAndProfile();
  }, []);

  // Fetch all students (Users NOT marked as 'teacher')
  useEffect(() => {
    if (!user) return;
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email') // Added email for more detail
        .neq('role', 'teacher'); 

      if (error) console.error('Error fetching students:', error);
      else setStudents(data || []);
    };
    fetchStudents();
  }, [user]);

  // Fetch messages with selected student AND set up real-time subscription
  useEffect(() => {
    if (!selectedStudent || !user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${selectedStudent.id}),and(sender_id.eq.${selectedStudent.id},recipient_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) console.error('Error fetching messages:', error);
      else setMessages(data || []);
    };

    fetchMessages();

    // Real-time subscription setup
    const messageChannel = supabase
      .channel(`messages:${selectedStudent.id}:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=in.(${user.id},${selectedStudent.id})`,
        },
        payload => {
          const msg = payload.new;
          if (
            (msg.sender_id === user.id && msg.recipient_id === selectedStudent.id) ||
            (msg.sender_id === selectedStudent.id && msg.recipient_id === user.id)
          ) {
            setMessages(prev => [...prev, msg]);
          }
        }
      )
      .subscribe();

    // CLEANUP FUNCTION
    return () => {
      if (messageChannel) {
        supabase.removeChannel(messageChannel);
      }
    };
  }, [selectedStudent, user]); 

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send new message
  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    const trimmedZoomLink = zoomLink.trim();

    if (!trimmedMessage && !trimmedZoomLink) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: user.id,
        recipient_id: selectedStudent.id,
        content: trimmedMessage, 
        zoom_link: trimmedZoomLink || null,
      },
    ]);

    if (error) console.error('Error sending message:', error);
    else {
      setNewMessage('');
      setZoomLink('');
    }
  };
  
  // Helper function for message grouping CSS (REUSED FROM STUDENT PAGE)
  const getMessageClasses = (msg, index) => {
    const isUser = msg.sender_id === user.id;
    const isNextFromSameUser = messages[index + 1]?.sender_id === msg.sender_id;

    let baseClasses = `p-3 text-sm max-w-[70%] flex flex-col shadow-sm ${
        isUser ? 'bg-sky-600 text-white self-end items-end' : 'bg-gray-100 text-gray-800 self-start items-start border border-gray-200'
    }`;
    
    if (isUser) {
        baseClasses += isNextFromSameUser ? ' rounded-t-xl rounded-bl-xl rounded-br-md' : ' rounded-t-xl rounded-bl-xl rounded-br-xl';
    } else {
        baseClasses += isNextFromSameUser ? ' rounded-t-xl rounded-br-xl rounded-bl-md' : ' rounded-t-xl rounded-br-xl rounded-bl-xl';
    }
    return baseClasses;
  };


  if (!user || !profile) {
    return <p className="p-10">Loading user session...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="Teacher" />
      <div className="max-w-7xl mx-auto flex pt-4 h-[calc(100vh-60px)]"> 
        <Sidebar role={role} />

        <main className="flex-1 p-6 flex gap-6">
          
          {/* 1. Contacts Column (Students List) */}
          <div className="w-full md:w-[350px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
            
            {/* Top Bar/Profile Section */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    {/* Placeholder for Profile Avatar */}
                    <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold mr-3">
                        {profile.full_name ? profile.full_name[0] : 'T'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{profile.full_name || 'Teacher'}</p>
                        <p className="text-xs text-green-500 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Online
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full p-2 pl-10 rounded-lg border border-gray-200 focus:ring-sky-500 focus:border-sky-500 transition"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Students List Scroll Area */}
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-0 divide-y divide-gray-100">
                    {students.map(student => (
                        <li
                            key={student.id}
                            className={`p-3 cursor-pointer transition-colors duration-200 flex items-center ${
                                selectedStudent?.id === student.id 
                                ? 'bg-sky-50 border-r-4 border-sky-500 font-semibold text-sky-800' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedStudent(student)}
                        >
                            {/* Placeholder Avatar */}
                            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold mr-3">
                                {student.full_name ? student.full_name[0] : 'S'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium truncate">{student.full_name}</p>
                                <p className="text-xs text-gray-500 truncate">{student.email}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          {/* 2. Chat Window Column (Main Content) */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
            {selectedStudent ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 shadow-sm flex items-center">
                    {/* Placeholder for Student Avatar */}
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold mr-3">
                        {selectedStudent.full_name ? selectedStudent.full_name[0] : 'S'}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{selectedStudent.full_name}</h3>
                        <p className="text-xs text-gray-500">Student</p>
                    </div>
                </div>
                
                {/* Scrollable Message Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2 flex flex-col">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={getMessageClasses(msg, index)} // Using helper function for grouping
                    >
                      {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                      {msg.zoom_link && (
                        <a
                          href={msg.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`underline text-sm mt-1 block ${msg.sender_id === user.id ? 'text-sky-100 hover:text-white' : 'text-sky-600 hover:text-sky-700'}`}
                        >
                          Zoom Link
                        </a>
                      )}
                      <span className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-sky-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} /> 
                </div>

                {/* Input Area (Sleek Redesign) */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex flex-col md:flex-row gap-2">
                    
                    {/* Primary Message Input */}
                    <div className="flex items-center flex-1 p-2 rounded-full border border-gray-300 bg-white shadow-inner">
                      <span className="text-gray-400 ml-2 mr-3 text-lg">💬</span> 
                      <input
                        type="text"
                        placeholder="Message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        className="flex-1 focus:outline-none"
                        onKeyPress={e => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                      />
                    </div>
                    
                    {/* Zoom Link Input */}
                    <div className="flex items-center flex-1 p-2 rounded-full border border-gray-300 bg-white shadow-inner">
                        <span className="text-gray-400 ml-2 mr-3 text-lg">🔗</span>
                        <input
                            type="text"
                            placeholder="Optional Zoom link..."
                            value={zoomLink}
                            onChange={e => setZoomLink(e.target.value)}
                            className="flex-1 focus:outline-none"
                            onKeyPress={e => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />
                    </div>

                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() && !zoomLink.trim()}
                        className="w-16 h-12 flex items-center justify-center bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:bg-sky-300 transition"
                    >
                        ➤
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 p-8 text-center">Select a student to start chatting.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}