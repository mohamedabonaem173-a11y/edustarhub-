// components/teacher/QuizList.js

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

const QUESTIONS_TABLE = 'questions';
const QUIZ_IMAGE_BUCKET = 'quiz_images';

export default function QuizList({ userId }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Function to fetch questions created by the current user
    const fetchQuestions = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setMessage('');

        try {
            const { data, error } = await supabase
                .from(QUESTIONS_TABLE)
                // Select all fields, ordered by newest first
                .select('*') 
                .eq('uploader_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setQuestions(data);
            setMessage(`Successfully loaded ${data.length} questions.`);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setMessage(`Failed to load questions: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Initial load
    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    // Function to delete a question
    const handleDelete = async (questionId, imagePath) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }
        
        setMessage('Deleting question...');

        try {
            // 1. Delete the image from Storage (if one exists)
            if (imagePath) {
                const { error: storageError } = await supabase.storage
                    .from(QUIZ_IMAGE_BUCKET)
                    .remove([imagePath]);

                if (storageError) throw storageError;
            }

            // 2. Delete the question entry from the 'questions' database table
            const { error: dbError } = await supabase
                .from(QUESTIONS_TABLE)
                .delete()
                .eq('id', questionId);

            if (dbError) throw dbError;

            // 3. Update the state to reflect the deletion
            setQuestions(prev => prev.filter(q => q.id !== questionId));
            setMessage('Question and associated image deleted successfully!');

        } catch (error) {
            console.error('Deletion Error:', error);
            setMessage(`Error deleting question: ${error.message}`);
        }
    };
    
    // Helper function to show the correct answer
    const getCorrectAnswer = (options, correctIndex) => {
        return options[correctIndex];
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-xl">
                <p className="text-lg text-violet-600">Loading your questions...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-violet-500">
            <h2 className="text-2xl font-bold text-violet-800 mb-4 flex justify-between items-center">
                My Created Questions 
                <button
                    onClick={fetchQuestions}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    title="Refresh List"
                >
                    🔄 Refresh
                </button>
            </h2>

            {message && (
                <div className={`p-3 mb-4 rounded-lg font-medium ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            
            {questions.length === 0 ? (
                <p className="text-gray-500 p-4 border rounded-lg">You haven't created any questions yet. Use the form above to get started!</p>
            ) : (
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={q.id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150">
                            
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {index + 1}. {q.question_text}
                                </h3>
                                <button
                                    onClick={() => handleDelete(q.id, q.image_path)}
                                    className="text-red-500 hover:text-red-700 transition text-sm font-medium ml-4"
                                >
                                    🗑️ Delete
                                </button>
                            </div>

                            {q.image_url && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">Associated Image:</p>
                                    <img 
                                        src={q.image_url} 
                                        alt="Question visual" 
                                        className="max-w-xs h-auto rounded-lg border"
                                    />
                                </div>
                            )}

                            <div className="space-y-1 mt-2">
                                <p className="text-sm font-medium text-gray-700">Options:</p>
                                {q.options.map((option, i) => (
                                    <p key={i} className={`text-sm pl-4 rounded ${i === q.correct_index ? 'font-bold text-green-700 bg-green-50 border border-green-200' : 'text-gray-600'}`}>
                                        {String.fromCharCode(65 + i)}. {option}
                                    </p>
                                ))}
                            </div>
                            
                            <p className="mt-3 text-sm font-bold text-green-700">
                                Correct Answer: {String.fromCharCode(65 + q.correct_index)}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Created: {new Date(q.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}