// pages/student/tools/flashcard-new.js (CORRECTED STATE MANAGEMENT)

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient'; 
import Navbar from '../../../components/Navbar'; 
import Sidebar from '../../../components/Sidebar'; 

// Constants
const FLASHCARD_SETS_TABLE = 'flashcard_sets';
const FLASHCARD_CARDS_TABLE = 'flashcard_cards';

// Initial state for a single card in the form
const initialCardState = { term: '', definition: '' };

export default function FlashcardNew() {
    const router = useRouter();
    const role = 'student';
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState([initialCardState, initialCardState]); // Start with two empty cards
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // --- Card Management Handlers (FIXED HERE) ---
    
    // Updates a single card's term or definition
    const handleCardChange = (index, field, value) => {
        // Create a copy of the cards array
        const newCards = [...cards];
        
        // Create a copy of the specific card object before modification (CRITICAL FIX)
        newCards[index] = { 
            ...newCards[index],
            [field]: value
        };
        
        setCards(newCards);
    };

    // Adds a new blank card row to the form
    const handleAddCard = () => {
        // Ensure initialCardState is a fresh object each time
        setCards([...cards, { term: '', definition: '' }]);
    };

    // Removes a card row, only if there are more than one card
    const handleRemoveCard = (index) => {
        if (cards.length > 1) {
            const newCards = cards.filter((_, i) => i !== index);
            setCards(newCards);
        }
    };

    // --- Submission Logic (Unchanged but included for completeness) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const session = (await supabase.auth.getSession()).data.session;
        if (!session) {
            setError('You must be logged in to create a flashcard set.');
            setLoading(false);
            return;
        }

        const currentUserId = session.user.id;

        // Filter out empty cards before submission
        const validCards = cards.filter(card => card.term.trim() !== '' && card.definition.trim() !== '');
        
        if (validCards.length === 0) {
            setError('Please add at least one card with both a term and definition.');
            setLoading(false);
            return;
        }

        let newSetId = null;

        try {
            // 1. Create the Flashcard Set Entry
            const { data: setCreationData, error: setError } = await supabase
                .from(FLASHCARD_SETS_TABLE)
                .insert([
                    {
                        user_id: currentUserId,
                        title,
                        subject,
                        description,
                        card_count: validCards.length,
                        is_public: false, 
                    }
                ])
                .select('id')
                .single();

            if (setError) throw setError;
            
            newSetId = setCreationData.id;

            // 2. Prepare Cards for Bulk Insertion
            const cardsToInsert = validCards.map(card => ({
                set_id: newSetId,
                term: card.term,
                definition: card.definition,
            }));

            // 3. Insert the Flashcards
            const { error: cardsError } = await supabase
                .from(FLASHCARD_CARDS_TABLE)
                .insert(cardsToInsert);

            if (cardsError) throw cardsError;

            // --- Success ---
            setSuccessMessage(`Set "${title}" and ${validCards.length} cards created successfully!`);
            
            setTimeout(() => {
                router.push('/student/tools/flashcard-builder');
            }, 1500);

        } catch (err) {
            console.error('Submission Error:', err);
            setError(`Failed to create set/cards: ${err.message || err.details}`);
        } finally {
            setLoading(false);
        }
    };


    // --- Render (Unchanged) ---
    return (
        <div className="min-h-screen bg-gray-100"> 
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">➕ Create New Flashcard Set</h1>
                    <p className="text-gray-500 mb-8">Define your set details and then add your terms and definitions below.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* --- Set Details Section --- */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Set Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Set Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="e.g., WWII Key Dates"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject / Topic</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="e.g., History"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <textarea
                                    id="description"
                                    rows="2"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="Brief overview of the set content..."
                                />
                            </div>
                        </div>

                        {/* --- Cards Section --- */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
                                Flashcards ({cards.filter(card => card.term.trim() !== '' && card.definition.trim() !== '').length} valid)
                                <button
                                    type="button"
                                    onClick={handleAddCard}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-150"
                                >
                                    + Add Card
                                </button>
                            </h2>
                            
                            <div className="space-y-4">
                                {cards.map((card, index) => (
                                    <div key={index} className="flex space-x-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex-1">
                                            <label htmlFor={`term-${index}`} className="block text-xs font-medium text-gray-600">Term</label>
                                            <input
                                                type="text"
                                                id={`term-${index}`}
                                                value={card.term}
                                                onChange={(e) => handleCardChange(index, 'term', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                                placeholder="e.g., Photosynthesis"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor={`definition-${index}`} className="block text-xs font-medium text-gray-600">Definition</label>
                                            <input
                                                type="text"
                                                id={`definition-${index}`}
                                                value={card.definition}
                                                onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                                placeholder="e.g., The process plants use..."
                                            />
                                        </div>
                                        {cards.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCard(index)}
                                                className="self-end p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-150"
                                                title="Remove card"
                                            >
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 6h6v10H7V6z" clipRule="evenodd" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- Submission & Status --- */}
                        {error && (
                            <div className="p-4 rounded-lg font-medium bg-red-100 text-red-700">
                                Submission Error: {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="p-4 rounded-lg font-medium bg-green-100 text-green-700">
                                Success: {successMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-5 py-3 text-lg font-medium rounded-lg text-white transition duration-150 ${
                                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                            }`}
                        >
                            {loading ? 'Saving Set & Cards...' : 'Create Flashcard Set'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}