// pages/teacher/manageofficehour.js
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient';

// --- Global Constants ---
const SESSION_PRICE = 350.00; // Fixed price for One-on-One
const CLASS_TYPE = 'one-on-one';
const TABLE_NAME = 'office_hours_requests'; // Corrected Plural Table Name

// Helper function for status badges
const getStatusBadge = (status) => {
    let colorClass;
    let text = status || 'Pending'; 
    switch (status) {
        case 'approved': colorClass = 'bg-green-100 text-green-700'; break;
        case 'pending': colorClass = 'bg-yellow-100 text-yellow-700'; break;
        case 'rejected': colorClass = 'bg-red-100 text-red-700'; break;
        default: colorClass = 'bg-gray-100 text-gray-700';
    }
    return (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${colorClass} capitalize`}>
            {text}
        </span>
    );
};

export default function TeacherManageOfficeHours() {
    const role = 'teacher';
    const [userId, setUserId] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for creating a NEW Listing
    const [subject, setSubject] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [zoomLink, setZoomLink] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        async function init() {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUserId = session?.user.id;

            if (session) {
                setUserId(currentUserId);
                
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', currentUserId)
                    .single();
                if (profile) setFullName(profile.full_name);
                
                fetchTeacherListings(currentUserId);
            } else {
                setLoading(false);
            }
        }
        init();
    }, []);

    // Fetch ALL sessions associated with this teacher
    const fetchTeacherListings = async (teacherId) => {
        if (!teacherId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from(TABLE_NAME) // CORRECTED TABLE NAME
            .select('*')
            .eq('teacher_id', teacherId)
            .order('requested_time', { ascending: false });

        if (!error) setListings(data || []);
        setLoading(false);
    };

    // --- Listing Creation Logic ---
    const createNewListing = async () => {
        if (!subject || !requestedTime || !zoomLink) {
            alert('Please fill in the Subject, Date/Time, and Zoom Link.');
            return;
        }
        if (!userId) {
            alert('Authentication error. Please log in again.');
            return;
        }

        const { data, error } = await supabase
            .from(TABLE_NAME) // CORRECTED TABLE NAME
            .insert([{
                teacher_id: userId,
                subject: subject,
                requested_time: requestedTime,
                zoom_link: zoomLink,
                status: 'approved',         // Automatically approved and available
                cost: SESSION_PRICE,        // Fixed cost
                class_type: CLASS_TYPE,     // Fixed type
                // student_id is correctly left NULL as per schema change.
            }])
            .select();

        if (error) {
            console.error('Failed to create listing:', error.message);
            return alert('Failed to create listing: ' + error.message);
        }

        if (data && data.length > 0) {
            setListings([data[0], ...listings]);
            setSubject('');
            setRequestedTime('');
            setZoomLink('');
            alert('New open session listing created successfully!');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Teacher" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} /> 
                <main className="flex-1 p-6 space-y-8">
                    <div className="bg-blue-600 p-8 rounded-xl shadow-2xl text-white">
                        <h1 className="text-3xl font-extrabold mb-1">Welcome, {fullName || 'Teacher'}!</h1>
                        <p className="text-blue-100">Manage your available office hours and student requests here.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4 h-fit">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">➕ Create New Open Session</h2>
                            
                            <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-sm text-yellow-800 mb-4">
                                This creates a **public, approved** listing for students to join. Price is fixed at {SESSION_PRICE.toFixed(2)} EGP.
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Session Subject / Topic</label>
                                    <input id="subject" type="text" placeholder="e.g., Biology Test Prep" value={subject} onChange={(e) => setSubject(e.target.value)} className="border border-gray-300 p-2 rounded-lg w-full"/>
                                </div>
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
                                    <input id="time" type="datetime-local" value={requestedTime} onChange={(e) => setRequestedTime(e.target.value)} className="border border-gray-300 p-2 rounded-lg w-full"/>
                                </div>
                                <div>
                                    <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 mb-1">Zoom/Meeting Link</label>
                                    <input id="zoom" type="url" placeholder="https://zoom.us/j/..." value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} className="border border-gray-300 p-2 rounded-lg w-full"/>
                                </div>
                                <button
                                    onClick={createNewListing}
                                    className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
                                >
                                    Publish Open Listing
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Office Hour Listings ({listings.length})</h2>
                            
                            {loading ? (
                                <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow">Loading your listings...</div>
                            ) : listings.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow">You have not created any listings yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {listings.map((item) => (
                                        <div key={item.id} className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-gray-900">{item.subject}</p>
                                                <p className="text-sm text-gray-600">
                                                    Scheduled: {new Date(item.requested_time).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Cost: {item.cost?.toFixed(2) || SESSION_PRICE.toFixed(2)} EGP | Type: {item.class_type?.replace('-', ' ') || CLASS_TYPE}
                                                </p>
                                                <a href={item.zoom_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block pt-1">
                                                    Meeting Link: {item.zoom_link ? 'View' : 'N/A'}
                                                </a>
                                            </div>
                                            
                                            <div className="flex flex-col items-end">
                                                {getStatusBadge(item.status)}
                                                <div className="text-xs text-gray-500 mt-2">
                                                    {item.status === 'approved' && item.zoom_link && <span className="text-green-600 font-medium">JOINABLE</span>}
                                                    {item.student_id && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Booked!</span>}
                                                    {!item.student_id && item.status === 'approved' && <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Open Slot</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}