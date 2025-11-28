// pages/teacher/quiz-maker.js - FINAL VERSION WITH STATE MANAGEMENT

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 

// Components are now correctly imported from components/teacher/
import QuizForm from '../../components/teacher/QuizForm';
import QuizList from '../../components/teacher/QuizList';

const QUESTIONS_TABLE = 'questions'; // Define the table name here

export default function QuizMaker() {
    const role = 'teacher';
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]); // State to hold all questions

    useEffect(() => {
        async function getUserId() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
            }
            setLoading(false);
        }
        getUserId();
    }, []);

    // --- Function to fetch questions (passed to QuizForm to trigger refresh) ---
    const fetchQuestions = useCallback(async () => {
        if (!userId) return;
        
        try {
            const { data, error } = await supabase
                .from(QUESTIONS_TABLE)
                .select('*') 
                .eq('uploader_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions for QuizMaker parent:', error);
        }
    }, [userId]);
    // ----------------------------------------------------------------------------


    // Load questions on initial mount or when userId becomes available
    useEffect(() => {
        if (userId) {
            fetchQuestions();
        }
    }, [userId, fetchQuestions]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-violet-600">Initializing Quiz Maker...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-red-600">Please log in to access the Quiz Maker.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50"> 
            <Navbar userRole="Teacher" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">📝 Quiz & Question Creator</h1>
                        <p className="text-gray-600 mt-2">Build quizzes, upload images for questions, and manage your tests.</p>
                    </div>

                    {/* The two main components, now linked by state */}
                    <div className="space-y-8">
                        <QuizForm 
                            userId={userId} 
                            // When the form successfully saves a question, it calls this function
                            onQuestionAdded={fetchQuestions} 
                        />

                        <QuizList 
                            userId={userId} 
                            questions={questions} // Pass the fetched list to the list component
                            onQuestionDeleted={fetchQuestions} // Trigger a refresh when a question is deleted
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}