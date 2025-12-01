// /pages/student/take-quiz.js

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router'; 

// --- Supabase Configuration (HARDCODED) ---
// 🛑 WARNING: Replace these placeholders with your actual keys.
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ---

export default function StudentTakeQuiz() {
    const router = useRouter();
    // Get the quiz ID dynamically from the URL query string (e.g., ?id=123)
    const { id: quizId } = router.query; 

    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    // --- Data Fetching Logic (Updated for Robustness) ---
    useEffect(() => {
        async function fetchQuizData() {
            // 1. Wait for the router to be ready and the ID to be available
            if (!router.isReady) {
                setLoading(true);
                return;
            }

            // 2. Check if the ID is actually missing in the URL
            if (!quizId) {
                setError("🛑 Error: No Quiz ID was provided in the URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch the quiz using the dynamic ID from the URL
                const { data, error } = await supabase
                    .from('quizzes')
                    .select('id, title, quiz_data')
                    .eq('id', quizId) 
                    .single();

                if (error || !data) {
                    throw new Error(`Quiz not found. ID: ${quizId}.`);
                }

                setQuiz(data);
                // Initialize answers state 
                const initialAnswers = {};
                data.quiz_data.forEach((_, index) => {
                    initialAnswers[index] = '';
                });
                setAnswers(initialAnswers);

            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError(`🛑 Error Loading Quiz\nDetails: ${err.message}`);
                setQuiz(null);
            } finally {
                setLoading(false);
            }
        }
        fetchQuizData();
    }, [router.isReady, quizId]); // Re-run when router is ready or quizId changes

    // --- Answer Handling Logic (same as before) ---
    const handleAnswerChange = useCallback((questionIndex, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionIndex]: selectedOption
        }));
    }, []);

    const handleSubmitQuiz = () => {
        if (!quiz) return;

        let score = 0;
        const totalQuestions = quiz.quiz_data.length;
        const resultDetails = quiz.quiz_data.map((q, index) => {
            const correctAnswer = q.correct_answer;
            const studentAnswer = answers[index];
            const isCorrect = studentAnswer === correctAnswer;

            if (isCorrect) {
                score++;
            }

            return {
                questionText: q.question_text,
                studentAnswer,
                correctAnswer,
                isCorrect,
                explanation: q.explanation
            };
        });

        setResults({
            score,
            totalQuestions,
            percentage: ((score / totalQuestions) * 100).toFixed(0),
            details: resultDetails,
        });
        setIsSubmitted(true);
    };

    // --- JSX Rendering (same as before) ---
    const renderQuestion = (q, index) => {
        const resultDetail = results?.details[index];

        return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Question {index + 1}: {q.question_text}
                </h3>

                {/* Answer Options */}
                <div className="space-y-2">
                    {q.options.map((option, optIndex) => {
                        const isSelected = answers[index] === option;
                        const isCorrect = isSubmitted && option === q.correct_answer;
                        const isIncorrect = isSubmitted && isSelected && !isCorrect;

                        let optionClass = "p-3 rounded-lg border cursor-pointer transition-colors duration-150";
                        if (!isSubmitted) {
                            optionClass += isSelected 
                                ? " border-violet-600 bg-violet-50 text-violet-800 font-medium" 
                                : " border-gray-300 hover:bg-gray-50";
                        } else {
                            if (isCorrect) {
                                optionClass += " border-green-500 bg-green-100 text-green-800 font-bold";
                            } else if (isIncorrect) {
                                optionClass += " border-red-500 bg-red-100 text-red-800 line-through";
                            } else {
                                optionClass += " border-gray-300 text-gray-600";
                            }
                        }

                        return (
                            <div
                                key={optIndex}
                                className={optionClass}
                                onClick={() => !isSubmitted && handleAnswerChange(index, option)}
                            >
                                {option}
                            </div>
                        );
                    })}
                </div>

                {/* Feedback/Explanation on Submission */}
                {isSubmitted && resultDetail && (
                    <div className={`mt-4 p-3 rounded-lg ${resultDetail.isCorrect ? 'bg-green-50' : 'bg-red-50'} border-l-4 ${resultDetail.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                        <p className="font-semibold">{resultDetail.isCorrect ? 'Correct!' : 'Incorrect.'}</p>
                        <p className="text-sm mt-1">{q.explanation}</p>
                    </div>
                )}
            </div>
        );
    };

    if (!router.isReady || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-violet-600">Loading quiz data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Quiz Loading Failed</h1>
                <pre className="text-red-500 bg-white p-4 rounded-lg shadow whitespace-pre-wrap">{error}</pre>
                <p className="mt-4 text-gray-600">Please navigate to the <a href="/student/quizzes" className="text-violet-600 hover:underline">Available Quizzes</a> page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Student" />
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">{quiz.title}</h1>

                {isSubmitted && results ? (
                    <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border-t-8 border-violet-600">
                        <h2 className="text-3xl font-bold text-violet-600 mb-2">Quiz Results</h2>
                        <p className="text-xl text-gray-700">You scored **{results.score} out of {results.totalQuestions}**.</p>
                        <p className="text-5xl font-extrabold mt-4 text-green-600">{results.percentage}%</p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400"
                        >
                            Review Answers
                        </button>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600 mb-6">Answer all questions below, then click Submit.</p>
                )}

                {/* Render Questions */}
                <div className="space-y-6">
                    {quiz.quiz_data.map(renderQuestion)}
                </div>
                
                {/* Submit Button */}
                {!isSubmitted && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(answers).length !== quiz.quiz_data.length || Object.values(answers).includes('')}
                            className="bg-violet-600 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-violet-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Submit Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}