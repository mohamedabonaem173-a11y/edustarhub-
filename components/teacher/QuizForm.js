// components/teacher/QuizForm.js - FINAL CODE WITH DATABASE SAVE

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Use the bucket you have configured
const QUIZ_IMAGE_BUCKET = 'quiz_images'; 
const QUESTIONS_TABLE = 'questions';

export default function QuizForm({ userId, onQuestionAdded }) {
    const [questionText, setQuestionText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [answers, setAnswers] = useState(['', '', '', '']); 
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        // Only accept one file
        setImageFile(e.target.files[0]);
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const resetForm = () => {
        setQuestionText('');
        setImageFile(null);
        setAnswers(['', '', '', '']);
        setCorrectAnswerIndex(0);
        document.getElementById('image-upload').value = '';
    }

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!questionText.trim() || answers.some(a => !a.trim())) {
            setMessage('Please fill out the question text and all answer options.');
            return;
        }

        setLoading(true);
        setMessage('Processing and saving question...');

        let imageUrl = null;
        let imagePath = null;
        
        // --- 1. Handle Image Upload (If a file is selected) ---
        if (imageFile) {
            try {
                const fileExt = imageFile.name.split('.').pop();
                const fileNameInBucket = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                // Store images under a user-specific folder
                imagePath = `${userId}/questions/${fileNameInBucket}`; 

                const { error: uploadError } = await supabase.storage
                    .from(QUIZ_IMAGE_BUCKET)
                    .upload(imagePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from(QUIZ_IMAGE_BUCKET)
                    .getPublicUrl(imagePath);
                
                imageUrl = publicUrlData.publicUrl;

            } catch (error) {
                console.error('Image Upload Error:', error);
                setMessage(`Error uploading image: ${error.message}`);
                setLoading(false);
                return;
            }
        }
        
        // --- 2. Create the Question Data Structure ---
        const questionData = {
            question_text: questionText.trim(),
            image_url: imageUrl, 
            image_path: imagePath, 
            options: answers,
            correct_index: correctAnswerIndex,
            uploader_id: userId, // Links the question to the teacher
        };

        // --- 3. Save Question to Database (UNCOMMENTED) ---
        try {
            const { error: dbError } = await supabase
                .from(QUESTIONS_TABLE)
                .insert([questionData]);

            if (dbError) throw dbError;

            setMessage('Question saved successfully!');
            resetForm(); 

            // If a list needs updating
            if(onQuestionAdded) onQuestionAdded(); 

        } catch (error) {
            console.error('Database Save Error:', error);
            setMessage(`Error saving question metadata. Check your 'questions' table RLS/schema. Error: ${error.message}`);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000); 
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Add New Question (Image Support)</h2>
            
            {message && (
                <div className={`p-3 mb-4 rounded-lg font-medium ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleQuestionSubmit} className="space-y-6">

                {/* Question Text */}
                <div>
                    <label htmlFor="questionText" className="block text-sm font-medium text-gray-700">Question Text</label>
                    <textarea
                        id="questionText"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="e.g., Which phase of mitosis is shown in the image?"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                {/* Image Upload for Question */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image for Question (Optional)</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                    />
                    {imageFile && <p className="mt-1 text-sm text-gray-600">File selected: **{imageFile.name}**</p>}
                </div>
                
                {/* Answer Options and Correct Answer Selector */}
                <fieldset className="space-y-4 border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-gray-800">Answer Options</legend>
                    
                    {answers.map((answer, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <input
                                id={`correct-${index}`}
                                type="radio"
                                name="correctAnswer"
                                checked={correctAnswerIndex === index}
                                onChange={() => setCorrectAnswerIndex(index)}
                                className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <label htmlFor={`correct-${index}`} className="text-sm font-medium text-gray-700 w-full">
                                Option {index + 1} (
                                {correctAnswerIndex === index ? <span className="text-green-600">Correct</span> : 'Select to mark as correct'}
                                )
                            </label>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={`Answer Option ${index + 1}`}
                                className="block flex-1 border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    ))}
                </fieldset>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
                    disabled={loading}
                >
                    {loading ? 'Saving Question...' : 'Save Question'}
                </button>
            </form>
        </div>
    );
}