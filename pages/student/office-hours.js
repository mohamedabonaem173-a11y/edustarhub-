// pages/student/office-hours.js
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient';

// --- Global Data Definitions ---
const SESSION_PRICE = 350.00; // Fixed price for One-on-One
const TABLE_NAME = 'office_hours_requests'; // Corrected Plural Table Name

const TEACHER_LIST_PLACEHOLDER = [
    { id: 'any', name: 'Any Available Teacher', subject: 'General' },
    { id: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6', name: 'Dr. Yusuf Biologist Master', subject: 'Biology' }, // Placeholder
];

// Helper function for status badges
const getStatusBadge = (status, size = 'sm') => {
    let colorClass;
    let text = status || 'Pending'; 

    switch (status) {
        case 'approved':
            colorClass = 'bg-green-100 text-green-700';
            break;
        case 'rejected':
            colorClass = 'bg-red-100 text-red-700';
            break;
        case 'pending':
        default:
            colorClass = 'bg-yellow-100 text-yellow-700';
    }
    
    const textSize = size === 'lg' ? 'text-base' : 'text-xs';
    
    return (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full ${textSize} font-medium ${colorClass} capitalize`}>
            {text}
        </span>
    );
};

export default function StudentOfficeHours() {
    const role = 'student';
    const [userId, setUserId] = useState(null);
    const [requests, setRequests] = useState([]);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [activeTab, setActiveTab] = useState('sessions');

    // Filter state
    const [filterSubject, setFilterSubject] = useState('');
    const [filterTeacher, setFilterTeacher] = useState('any');

    useEffect(() => {
        async function init() {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUserId = session?.user.id;

            if (session) {
                setUserId(currentUserId);
            }

            fetchRequests(currentUserId);
            fetchAvailableSessions();
        }
        init();
    }, []);

    // Fetch sessions previously requested by *this* student (for history tab)
    const fetchRequests = async (studentId) => {
        if (!studentId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*, teacher:teacher_id(full_name)')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });

        if (!error) setRequests(data || []);
        setLoading(false);
    };

    // Fetch OPEN, APPROVED, UPCOMING sessions (Teacher Listings)
    const fetchAvailableSessions = async () => {
        setLoadingSessions(true);
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
            .from(TABLE_NAME) // CORRECTED TABLE NAME
            .select('*, teacher:teacher_id(full_name)')
            .eq('status', 'approved')
            .neq('zoom_link', null)
            .gt('requested_time', now)
            .order('requested_time', { ascending: true });

        if (error) console.error('Error fetching available sessions:', error);
        else setAvailableSessions(data || []);
        
        setLoadingSessions(false);
    };

    const renderAvailableSessions = () => {
        // ... (render logic remains the same, using the correct fetching functions) ...
        if (loadingSessions) {
            return <div className="p-6 text-center text-gray-500">Searching for available sessions...</div>;
        }
        if (availableSessions.length === 0) {
            return <div className="p-6 text-center text-gray-500">No approved, upcoming sessions are currently available to join.</div>;
        }

        const filteredSessions = availableSessions.filter(s => 
            (filterSubject === '' || s.subject.toLowerCase().includes(filterSubject.toLowerCase())) &&
            (filterTeacher === 'any' || s.teacher_id === filterTeacher)
        );

        return filteredSessions.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-4 flex justify-between items-stretch">
                <div className="flex-grow space-y-2">
                    <p className="text-xl font-bold text-gray-900">{s.subject}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Teacher:</span> {s.teacher?.full_name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Time:</span> {new Date(s.requested_time).toLocaleString()}
                    </p>
                    <div className="flex space-x-2 pt-1">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">One-on-One</span>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{s.subject}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between ml-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-green-700">Ready to Join</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{SESSION_PRICE.toFixed(0)} EGP</p>
                    </div>
                    <a 
                        href={s.zoom_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md whitespace-nowrap"
                    >
                        Join Session
                    </a>
                </div>
            </div>
        ));
    };

    const renderRecentRequests = () => {
        // ... (render logic remains the same) ...
        if (loading) {
            return <div className="p-6 text-center text-gray-500">Loading your recent requests...</div>;
        }
        if (requests.length === 0) {
            return <div className="p-6 text-center text-gray-500">You haven't submitted any office hour requests yet.</div>;
        }

        return requests.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-4 flex justify-between items-stretch">
                <div className="flex-grow space-y-2">
                    <p className="text-xl font-bold text-gray-900">{r.subject}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Teacher:</span> {r.teacher?.full_name || 'Unassigned'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Requested:</span> {new Date(r.requested_time).toLocaleString()}
                    </p>
                    <div className="flex space-x-2 pt-1">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">One-on-One</span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{r.cost?.toFixed(0) || SESSION_PRICE.toFixed(0)} EGP</span>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between ml-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-500">Status</p>
                        <div className="mt-1">{getStatusBadge(r.status, 'lg')}</div>
                    </div>
                    <button disabled className="px-6 py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg cursor-not-allowed whitespace-nowrap mt-4">
                        View History
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Student" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} /> 
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Office Hours Portal</h1>
                    <p className="text-gray-500 mb-6">View and join currently available One-on-One sessions with our expert teachers.</p>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                                <p className="text-sm font-bold text-gray-800 mb-3">View Listings</p>
                                <button
                                    onClick={() => setActiveTab('sessions')}
                                    className={`w-full text-left py-2 px-3 rounded-lg text-lg font-semibold mb-2 transition ${activeTab === 'sessions' ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Available Sessions
                                </button>
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className={`w-full text-left py-2 px-3 rounded-lg text-lg font-semibold transition ${activeTab === 'requests' ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    My Request History
                                </button>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Filter Sessions</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="filter-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                        <input id="filter-subject" type="text" placeholder="e.g., Biology" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="border border-gray-300 p-2 rounded-lg w-full"/>
                                    </div>
                                    <div>
                                        <label htmlFor="filter-teacher" className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                                        <select 
                                            id="filter-teacher" 
                                            value={filterTeacher} 
                                            onChange={(e) => setFilterTeacher(e.target.value)} 
                                            className="border border-gray-300 p-2 rounded-lg w-full bg-white"
                                        >
                                            {TEACHER_LIST_PLACEHOLDER.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{activeTab === 'sessions' ? `Available Sessions (${availableSessions.length})` : `My Request History (${requests.length})`}</h2>
                            {activeTab === 'sessions' && renderAvailableSessions()}
                            {activeTab === 'requests' && renderRecentRequests()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}