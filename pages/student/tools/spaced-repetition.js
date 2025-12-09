// pages/student/tools/spaced-repetition.js
import React from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';

export default function SpacedRepetition() {
    const role = 'student';

    return (
        <div className="min-h-screen bg-gray-900 font-mono text-gray-100">
            <Navbar userRole="Student" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />

                <main className="flex-1 p-8 flex flex-col items-center justify-center">
                    <div className="text-center bg-gray-850 p-12 rounded-3xl shadow-2xl border-2 border-cyan-500 animate-pulse">
                        <h1 className="text-5xl font-extrabold text-cyan-400 mb-4 tracking-widest">⏳ Spaced Repetition</h1>
                        <p className="text-xl text-gray-400 mb-6">
                            Master your memory with smart review schedules! ⚡
                        </p>

                        <div className="text-6xl mb-6 animate-bounce">🧠💾</div>

                        <p className="text-lg text-gray-400">
                            This feature is <span className="font-bold text-cyan-400">coming soon</span>! 🚀
                        </p>

                        <p className="mt-6 text-gray-500 italic">
                            While you wait, try building flashcards or reviewing existing sets.
                        </p>

                        <button
                            onClick={() => alert("Redirect to Flashcard Builder or Practice (coming soon)!")}
                            className="mt-8 px-8 py-4 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400 transition shadow-lg hover:shadow-cyan-600/50 transform hover:scale-105"
                        >
                            Explore Flashcards
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
