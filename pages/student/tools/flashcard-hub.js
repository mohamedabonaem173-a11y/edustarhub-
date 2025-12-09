import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';


export default function FlashcardHub() {
const role = 'student';
const [sets, setSets] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
async function load() {
const { data } = await supabase
.from('flashcard_sets')
.select('id, title, description, created_at')
.order('created_at', { ascending: false });
setSets(data || []);
setLoading(false);
}
load();
}, []);


return (
<div className="min-h-screen bg-gray-50">
<Navbar userRole="Student" />
<div className="max-w-7xl mx-auto flex pt-4">
<Sidebar role={role} />
<main className="flex-1 p-8">
<div className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">Flashcard Sets</h1>
<Link href="/student/tools/flashcard-builder/new">
<a className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Create Set</a>
</Link>
</div>


{loading ? <p>Loading...</p> : (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{sets.map(s => (
<div key={s.id} className="bg-white p-4 rounded-xl shadow">
<h2 className="font-semibold">{s.title}</h2>
<p className="text-sm text-gray-500">{s.description}</p>
<div className="mt-4 flex gap-2">
<Link href={`/student/tools/flashcard-builder/${s.id}`}><a className="text-indigo-600">Edit</a></Link>
<Link href={`/student/tools/flashcard-practice?setId=${s.id}`}><a className="text-green-600">Study</a></Link>
</div>
</div>
))}
</div>
)}
</main>
</div>
</div>
);
}