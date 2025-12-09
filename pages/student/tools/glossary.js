// pages/student/tools/glossary.js

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';

export default function SchoolDictionary() {
    const role = 'student';

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [definitions, setDefinitions] = useState([]);
    const [error, setError] = useState(null);
    const [activeSubject, setActiveSubject] = useState('All');

    // --- SUBJECT LIST ---
    const subjectCategories = [
        "All",
        "Biology",
        "Math",
        "History",
        "Literature",
        "Computer Science"
    ];

    // --- SUBJECT CLASSIFICATION BASED ON KEYWORDS ---
    const classifySubject = (definition) => {
        const text = definition.toLowerCase();

        if (
            text.includes("organism") ||
            text.includes("tissue") ||
            text.includes("living") ||
            text.includes("genetic") ||
            text.includes("biology") ||
            text.includes("ecosystem") ||
            text.includes("cell") ||
            text.includes("anatomy")
        ) return "Biology";

        if (
            text.includes("equation") ||
            text.includes("variable") ||
            text.includes("geometry") ||
            text.includes("number") ||
            text.includes("rate of change") ||
            text.includes("calculus")
        ) return "Math";

        if (
            text.includes("government") ||
            text.includes("society") ||
            text.includes("political") ||
            text.includes("empire") ||
            text.includes("ancient") ||
            text.includes("revolution")
        ) return "History";

        if (
            text.includes("computer") ||
            text.includes("program") ||
            text.includes("code") ||
            text.includes("algorithm") ||
            text.includes("data")
        ) return "Computer Science";

        if (
            text.includes("poem") ||
            text.includes("figurative") ||
            text.includes("literary") ||
            text.includes("metaphor") ||
            text.includes("novel")
        ) return "Literature";

        return "Other";
    };

    // --- SEARCH FUNCTION ---
    const searchWord = async () => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        setError(null);
        setDefinitions([]);

        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);
            if (!res.ok) throw new Error("Word not found");

            const data = await res.json();

            // Extract & classify definitions
            const processed = data.flatMap(entry =>
                entry.meanings.flatMap(meaning =>
                    meaning.definitions.map(def => ({
                        definition: def.definition,
                        example: def.example || null,
                        partOfSpeech: meaning.partOfSpeech,
                        subject: classifySubject(def.definition)
                    }))
                )
            );

            setDefinitions(processed);

        } catch (err) {
            setError("No results found for this word.");
        } finally {
            setLoading(false);
        }
    };

    // --- Filter By Selected Subject ---
    const displayedDefinitions = activeSubject === "All"
        ? definitions
        : definitions.filter(d => d.subject === activeSubject);

    return (
        <div className="min-h-screen bg-gray-900 font-mono text-gray-100">
            <Navbar userRole="Student" />

            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />

                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-extrabold text-cyan-400 mb-2">📘 School Dictionary</h1>
                    <p className="text-gray-400 mb-6">Get subject-specific meanings (biology, math, history, etc.).</p>

                    {/* Search + Subject filter */}
                    <div className="bg-gray-850 p-6 rounded-xl shadow-lg border border-cyan-500 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search for a word (e.g., cell)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 p-3 border border-gray-700 rounded-lg shadow-inner bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />

                            <select
                                value={activeSubject}
                                onChange={(e) => setActiveSubject(e.target.value)}
                                className="w-full md:w-56 p-3 border border-gray-700 rounded-lg shadow-inner bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                {subjectCategories.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>

                            <button
                                onClick={searchWord}
                                className="px-6 py-3 bg-cyan-500 text-gray-900 font-semibold rounded-lg shadow hover:bg-cyan-400 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Results</h2>

                    {loading && (
                        <p className="bg-gray-850 p-4 border border-cyan-500 rounded-lg">Searching dictionary...</p>
                    )}

                    {error && (
                        <p className="bg-red-900 text-red-400 p-4 rounded-lg">{error}</p>
                    )}

                    {!loading && displayedDefinitions.length === 0 && !error && (
                        <p className="text-gray-500 italic">No definitions found. Try searching a word.</p>
                    )}

                    {/* Display definitions */}
                    <div className="space-y-4">
                        {displayedDefinitions.map((item, index) => (
                            <div key={index} className="bg-gray-850 p-5 rounded-xl shadow-md border border-cyan-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-cyan-400 capitalize">
                                        {item.partOfSpeech}
                                    </h3>
                                    <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                                        {item.subject}
                                    </span>
                                </div>

                                <p className="text-gray-200 mb-2">{item.definition}</p>

                                {item.example && (
                                    <p className="text-gray-400 italic text-sm">“{item.example}”</p>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
