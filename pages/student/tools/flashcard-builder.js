// pages/student/tools/flashcard-builder.js
import React from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';

export default function FlashcardBuilder() {
    const role = 'student';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-mono">
            <Navbar userRole="Student" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />

                <main className="flex-1 p-8 flex flex-col items-center justify-center">
                    <div className="text-center bg-gray-850 p-12 rounded-3xl shadow-2xl border-2 border-cyan-500 animate-pulse">
                        <h1 className="text-5xl font-extrabold text-cyan-400 mb-4 tracking-widest">🃏 Flashcard Builder</h1>
                        <p className="text-xl text-gray-300 mb-6">Create your own flashcards and hack your learning! ⚡</p>

                        <div className="text-6xl mb-6 animate-bounce">🧠💾</div>

                        <p className="text-lg text-gray-400">
                            This feature is <span className="font-bold text-cyan-400">coming soon</span>! 🛠️
                        </p>

                        <p className="mt-6 text-gray-500 italic">
                            While you wait, check out the glossary or practice existing flashcards.
                        </p>

                        <button
                            onClick={() => alert("Redirect to Flashcard Practice (coming soon)!")}
                            className="mt-8 px-8 py-4 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400 transition shadow-lg hover:shadow-cyan-600/50 transform hover:scale-105"
                        >
                            Go to Flashcard Practice
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
