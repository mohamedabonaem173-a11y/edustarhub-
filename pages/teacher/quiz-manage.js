import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- 1. Supabase Configuration (Using Environment Variables) ---
// Keys are read securely from the .env.local file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get the current logged-in user's ID
const getUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
};

// --- 2. CSS STYLES ---
const styles = {
    container: {
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '20px',
        background: '#f8f8f8',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    h1: {
        color: '#2c3e50',
        borderBottom: '3px solid #3498db',
        paddingBottom: '10px',
        marginBottom: '20px'
    },
    quizCard: {
        border: '1px solid #ecf0f1',
        background: '#ffffff',
        padding: '20px',
        marginTop: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quizTitle: {
        margin: 0,
        color: '#34495e',
    },
    quizDetails: {
        fontSize: '0.9em',
        color: '#7f8c8d',
        marginTop: '5px',
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    copyBtn: {
        backgroundColor: '#2ecc71',
    },
    deleteBtn: {
        backgroundColor: '#e74c3c',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2em',
        color: '#3498db',
        padding: '50px 0',
    }
};

function QuizManager() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Logic ---
    const fetchQuizzes = async () => {
        setLoading(true);
        setError(null);
        
        // This is the mock ID used for anonymous testing
        const mockUserId = '00000000-0000-0000-0000-000000000000';
        // In a real app, you would use the logged-in user ID, but we use the mock ID for now.
        const teacherId = mockUserId; 

        if (!teacherId) {
            setError("Cannot fetch quizzes: Teacher ID not available.");
            setLoading(false);
            return;
        }

        try {
            // Fetch all quizzes where the teacher_id matches our mock ID.
            const { data, error } = await supabase
                .from('quizzes')
                .select('id, title, created_at, quiz_data')
                .eq('teacher_id', teacherId) // Filter by our mock ID
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setQuizzes(data || []);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setError(`Failed to load quizzes: ${err.message || err.details}`);
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    // --- Action Handlers ---

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete the quiz: "${title}"? This cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('quizzes')
                .delete()
                .eq('id', id)
                // We add an RLS safety check here, though the database policy should enforce it.
                .eq('teacher_id', '00000000-0000-0000-0000-000000000000'); 

            if (error) {
                throw error;
            }

            // If successful, refresh the list
            alert(`✅ Quiz "${title}" successfully deleted.`);
            fetchQuizzes();

        } catch (err) {
            console.error("Error deleting quiz:", err);
            alert(`🛑 Failed to delete quiz: ${err.message}`);
        }
    };

    const handleCopyLink = (id) => {
        const link = `${window.location.origin}/student/take-quiz?id=${id}`;
        navigator.clipboard.writeText(link);
        alert(`🔗 Quiz link copied to clipboard: ${link}`);
    };
    
    // --- Render Logic ---

    if (loading) {
        return <div style={styles.loading}>Loading quizzes...</div>;
    }

    if (error) {
        return <div style={{ ...styles.container, color: styles.deleteBtn.backgroundColor }}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Teacher Quiz Manager ({quizzes.length} Quizzes)</h1>

            {quizzes.length === 0 ? (
                <div style={styles.loading}>
                    No quizzes found. Please create one using the Quiz Maker page.
                </div>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.id} style={styles.quizCard}>
                        <div>
                            <h2 style={styles.quizTitle}>{quiz.title} (ID: {quiz.id})</h2>
                            <div style={styles.quizDetails}>
                                Created: {new Date(quiz.created_at).toLocaleDateString()}
                                | Questions: {quiz.quiz_data.length}
                                | Teacher ID: {quiz.teacher_id} 
                            </div>
                        </div>
                        <div style={styles.actions}>
                            {/* In a real app, this would link to an edit page */}
                            <button 
                                onClick={() => alert("Edit feature coming soon!")}
                                style={styles.button}
                            >
                                Edit Quiz
                            </button>
                            
                            <button 
                                onClick={() => handleCopyLink(quiz.id)}
                                style={{...styles.button, ...styles.copyBtn}}
                            >
                                Copy Student Link
                            </button>

                            <button 
                                onClick={() => handleDelete(quiz.id, quiz.title)}
                                style={{...styles.button, ...styles.deleteBtn}}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
            
            {/* Optional: Button to quickly navigate to maker page */}
            <a href="/teacher/quiz-maker" style={{...styles.button, marginTop: '20px', display: 'inline-block', textDecoration: 'none'}}>
                + Create New Quiz
            </a>
        </div>
    );
}

export default QuizManager;