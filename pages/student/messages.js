// pages/student/messages.js
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

export default function StudentMessages() {
  const role = 'student';

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [zoomLink, setZoomLink] = useState('');

  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (!user) return;
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'teacher');
      if (!error) setTeachers(data || []);
    };
    fetchTeachers();
  }, [user]);

  useEffect(() => {
    if (!selectedTeacher || !user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${selectedTeacher.id}),and(sender_id.eq.${selectedTeacher.id},recipient_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });
      if (!error) setMessages(data || []);
    };

    fetchMessages();

    const messageChannel = supabase
      .channel(`messages:${selectedTeacher.id}:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=in.(${user.id},${selectedTeacher.id})` },
        payload => {
          const msg = payload.new;
          if (
            (msg.sender_id === user.id && msg.recipient_id === selectedTeacher.id) ||
            (msg.sender_id === selectedTeacher.id && msg.recipient_id === user.id)
          ) {
            setMessages(prev => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(messageChannel);
  }, [selectedTeacher, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    const trimmedZoomLink = zoomLink.trim();
    if (!trimmedMessage && !trimmedZoomLink) return;

    const { error } = await supabase.from('messages').insert([{
      sender_id: user.id,
      recipient_id: selectedTeacher.id,
      content: trimmedMessage,
      zoom_link: trimmedZoomLink || null,
    }]);
    if (!error) {
      setNewMessage('');
      setZoomLink('');
    }
  };

  if (!user || !profile) return <p className="p-10 text-cyan-400 animate-pulse text-2xl">Loading user session...</p>;

  const getMessageClasses = (msg, index) => {
    const isUser = msg.sender_id === user.id;
    const isNextFromSameUser = messages[index + 1]?.sender_id === msg.sender_id;
    let base = `p-5 text-lg max-w-[75%] flex flex-col shadow-md transition-all duration-300 ${
      isUser ? 'self-end items-end bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
             : 'self-start items-start bg-gray-800 text-gray-200 border border-gray-700'
    }`;
    base += isUser ? (isNextFromSameUser ? ' rounded-t-2xl rounded-bl-2xl rounded-br-lg' : ' rounded-2xl') 
                   : (isNextFromSameUser ? ' rounded-t-2xl rounded-br-2xl rounded-bl-lg' : ' rounded-2xl');
    return base;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
      {/* Neon particle background */}
      <canvas id="neonParticles" className="absolute inset-0 z-0"></canvas>

      <Navbar userRole="Student" />

      <div className="max-w-7xl mx-auto flex pt-4 gap-6 flex-1 h-[calc(100vh-64px)] relative z-10">
        <Sidebar role={role} />

        <main className="flex-1 flex gap-6 text-lg">

          {/* Contacts */}
          <div className="w-full md:w-[400px] bg-gray-900 rounded-2xl shadow-[0_0_35px_cyan] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-cyan-700 flex items-center justify-center font-bold mr-4 text-black text-2xl">
                  {profile.full_name ? profile.full_name[0] : 'S'}
                </div>
                <div>
                  <p className="font-semibold text-cyan-400 text-xl">{profile.full_name || 'Student'}</p>
                  <p className="text-sm flex items-center text-green-400">
                    <span className="w-3 h-3 rounded-full bg-green-400 mr-1 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  className="w-full p-3 pl-12 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-cyan-500 focus:border-cyan-500 transition text-lg"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">🔍</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="space-y-0 divide-y divide-gray-700">
                {teachers.map(t => (
                  <li key={t.id}
                    className={`p-4 cursor-pointer flex items-center transition-colors duration-200 text-lg ${
                      selectedTeacher?.id === t.id ? 'bg-cyan-900 border-r-4 border-cyan-500 font-semibold text-cyan-400' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedTeacher(t)}
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-800 text-black flex items-center justify-center font-bold mr-4 text-2xl">
                      {t.full_name ? t.full_name[0] : 'T'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium truncate">{t.full_name}</p>
                      <p className="text-sm text-gray-400 truncate">{t.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-gray-900 rounded-2xl shadow-[0_0_35px_cyan] overflow-hidden">
            {selectedTeacher ? (
              <>
                <div className="p-5 border-b border-gray-700 flex items-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-800 flex items-center justify-center font-bold mr-4 text-black text-2xl">
                    {selectedTeacher.full_name ? selectedTeacher.full_name[0] : 'T'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400">{selectedTeacher.full_name}</h3>
                    <p className="text-sm text-gray-400">Teacher</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4 flex flex-col">
                  {messages.map((msg, i) => (
                    <div key={msg.id} className={getMessageClasses(msg, i)}>
                      {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                      {msg.zoom_link && (
                        <a href={msg.zoom_link} target="_blank" rel="noopener noreferrer"
                          className={`underline text-lg mt-2 block ${msg.sender_id === user.id ? 'text-cyan-200 hover:text-white' : 'text-cyan-400 hover:text-cyan-200'}`}>
                          Zoom Link
                        </a>
                      )}
                      <span className={`text-sm mt-1 ${msg.sender_id === user.id ? 'text-cyan-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-5 border-t border-gray-700 bg-gray-800">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex items-center flex-1 p-3 rounded-full border border-gray-700 bg-gray-900 shadow-inner">
                      <span className="text-gray-500 ml-3 mr-4 text-2xl">💬</span>
                      <input
                        type="text"
                        placeholder="Message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        className="flex-1 bg-gray-900 focus:outline-none text-white text-lg"
                        onKeyPress={e => { if(e.key==='Enter') sendMessage(); }}
                      />
                    </div>

                    <div className="flex items-center flex-1 p-3 rounded-full border border-gray-700 bg-gray-900 shadow-inner">
                      <span className="text-gray-500 ml-3 mr-4 text-2xl">🔗</span>
                      <input
                        type="text"
                        placeholder="Optional Zoom link..."
                        value={zoomLink}
                        onChange={e => setZoomLink(e.target.value)}
                        className="flex-1 bg-gray-900 focus:outline-none text-white text-lg"
                        onKeyPress={e => { if(e.key==='Enter') sendMessage(); }}
                      />
                    </div>

                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() && !zoomLink.trim()}
                      className="w-20 h-14 flex items-center justify-center bg-cyan-600 text-black rounded-full hover:bg-cyan-500 disabled:bg-gray-700 transition text-2xl"
                    >
                      ➤
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 p-10 text-center text-2xl">Select a teacher to start chatting.</p>
            )}
          </div>
        </main>
      </div>

      {/* Neon Particles Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          const canvas = document.getElementById('neonParticles');
          const ctx = canvas.getContext('2d');
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          const particles = Array.from({length: 80}, () => ({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            r: Math.random()*3+1,
            dx: (Math.random()-0.5)*1.2,
            dy: (Math.random()-0.5)*1.2,
            color: ['#0ff','#0fc','#0cf','#3ff'][Math.floor(Math.random()*4)]
          }));
          function animate() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            particles.forEach(p=>{
              p.x+=p.dx; p.y+=p.dy;
              if(p.x<0||p.x>canvas.width)p.dx*=-1;
              if(p.y<0||p.y>canvas.height)p.dy*=-1;
              ctx.beginPath();
              ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
              ctx.fillStyle=p.color;
              ctx.fill();
            });
            requestAnimationFrame(animate);
          }
          animate();
          window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight});
          `
        }}
      />
    </div>
  );
}
