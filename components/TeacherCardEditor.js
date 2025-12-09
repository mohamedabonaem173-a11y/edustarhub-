// components/TeacherCardEditor.js

import React, { useState, useEffect } from 'react';
// CORRECTED PATH with file extension for reliability
import { supabase } from '../lib/supabaseClient.js'; 

// This component is the row for a single flashcard
const FlashcardRow = ({ card, index, updateCard, removeCard }) => {
    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 border-b border-gray-200 rounded-lg mb-2">
            <span className="text-gray-500 font-semibold w-6 text-center">{index + 1}</span>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Term Input */}
                <input
                    type="text"
                    placeholder="Term"
                    value={card.term}
                    onChange={(e) => updateCard(index, 'term', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                
                {/* Definition Input */}
                <input
                    type="text"
                    placeholder="Definition"
                    value={card.definition}
                    onChange={(e) => updateCard(index, 'definition', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            
            {/* Delete Button */}
            <button
                onClick={() => removeCard(index)}
                className="p-2 text-red-500 hover:text-red-700 transition duration-150"
                title="Remove Card"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

// Main Editor Component
const TeacherCardEditor = ({ selectedSetId }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // For success/error messages

    // ------------------------------------
    // 1. DATA FETCHING (LOAD EXISTING CARDS)
    // ------------------------------------
    useEffect(() => {
        if (!selectedSetId) {
            setCards([]);
            return;
        }

        const fetchCards = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('flashcards') // Assumes 'flashcards' table
                .select('id, term, definition')
                .eq('set_id', selectedSetId)
                .order('created_at', { ascending: true }); 

            if (error) {
                console.error('Error fetching cards:', error);
                setStatus({ type: 'error', message: 'Failed to load existing cards.' });
                setCards([]);
            } else {
                // Ensure data has the required fields, even if Supabase returns null
                setCards(data.map(card => ({
                    id: card.id,
                    term: card.term || '',
                    definition: card.definition || '',
                    set_id: selectedSetId,
                })));
                setStatus(null);
            }
            setLoading(false);
        };

        fetchCards();
    }, [selectedSetId]); 

    // ------------------------------------
    // 2. CARD MANAGEMENT LOGIC
    // ------------------------------------

    const addCard = () => {
        // Only add an empty card if the last card isn't already empty (UX improvement)
        if (cards.length === 0 || cards[cards.length - 1].term.trim() !== '' || cards[cards.length - 1].definition.trim() !== '') {
            setCards([...cards, { term: '', definition: '', set_id: selectedSetId }]);
        }
    };

    const updateCard = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const removeCard = (index) => {
        const newCards = cards.filter((_, i) => i !== index);
        setCards(newCards);
    };

    // ------------------------------------
    // 3. DATABASE SYNC (SAVE CHANGES)
    // ------------------------------------
    const handleSave = async () => {
        if (!selectedSetId) {
            setStatus({ type: 'error', message: 'Please select or create a set first.' });
            return;
        }
        setLoading(true);
        setStatus(null);

        // Prepare cards for Upsert (Insert/Update). Filter out rows where both fields are empty.
        const validCards = cards
            .filter(card => card.term.trim() !== '' || card.definition.trim() !== '')
            .map(card => ({
                ...card,
                set_id: selectedSetId,
            }));

        try {
            // Step A: Determine which cards to DELETE from the DB
            const { data: existingCards, error: fetchError } = await supabase
                .from('flashcards')
                .select('id')
                .eq('set_id', selectedSetId);
            
            if (fetchError) throw fetchError;

            const existingIds = existingCards.map(c => c.id);
            const currentValidIds = validCards.map(c => c.id).filter(Boolean); // IDs of cards currently in the editor
            
            // IDs to delete (were in DB, but are NOT in the current valid editor list)
            const idsToDelete = existingIds.filter(id => id && !currentValidIds.includes(id));
            
            // 1. Execute Deletion
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('flashcards')
                    .delete()
                    .in('id', idsToDelete);
                if (deleteError) throw deleteError;
            }

            // 2. Execute Upsert (Insert/Update)
            let newCardsData = [];
            if (validCards.length > 0) {
                const { data: upsertData, error: upsertError } = await supabase
                    .from('flashcards')
                    .upsert(validCards, { onConflict: 'id' })
                    .select('id, term, definition'); // Select new data to update local state
                
                if (upsertError) throw upsertError;
                newCardsData = upsertData;
            }
            
            setCards(newCardsData); // Update state with fresh data and IDs
            setStatus({ type: 'success', message: `Successfully saved ${newCardsData.length} cards.` });

        } catch (error) {
            console.error('Save error:', error.message);
            setStatus({ type: 'error', message: `Save failed: ${error.message}` });
        }
        setLoading(false);
    };

    // ------------------------------------
    // 4. RENDER
    // ------------------------------------
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card Editor</h2>
            
            {status && (
                <div className={`p-3 mb-4 rounded-md ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {status.message}
                </div>
            )}

            {loading && !status && (
                <p className="text-indigo-600 mb-4">Loading cards...</p>
            )}

            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {/* Table Header */}
                 <div className="flex items-center space-x-4 p-2 bg-gray-200 border-b border-gray-300 rounded-t-lg font-bold text-sm text-gray-700 sticky top-0">
                    <span className="w-6 text-center">#</span>
                    <span className="flex-1 grid grid-cols-2 gap-4">Term</span>
                    <span className="flex-1 grid grid-cols-2 gap-4">Definition</span>
                    <div className="w-10"></div> {/* Spacer for delete button */}
                </div>
                
                {cards.map((card, index) => (
                    <FlashcardRow 
                        key={card.id || `new-${index}`}
                        card={card}
                        index={index}
                        updateCard={updateCard}
                        removeCard={removeCard}
                    />
                ))}
            </div>

            <div className="mt-4 flex space-x-4">
                <button
                    onClick={addCard}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Card</span>
                </button>
                
                <button
                    onClick={handleSave}
                    disabled={loading || !selectedSetId}
                    className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-150 ${loading || !selectedSetId ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {loading ? 'Saving...' : 'Save All Cards'}
                </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
                You have {cards.filter(c => c.term.trim() !== '' && c.definition.trim() !== '').length} valid terms in the current set.
            </p>
        </div>
    );
};

export default TeacherCardEditor;