// pages/student/tools/flashcard-practice.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import { supabase } from '../../../lib/supabaseClient';

const CARDS_TABLE = 'flashcard_cards';
const SETS_TABLE = 'flashcard_sets';

// simplified SRS date calculator (same as you had, tuned)
function calculateNextReview(card, rating) {
  const now = new Date();
  const newLastReview = now.toISOString();

  let intervalMinutes;
  switch (rating) {
    case 'Hard': intervalMinutes = 5; break;
    case 'Good': intervalMinutes = 60; break;
    case 'Easy': intervalMinutes = 4 * 24 * 60; break;
    default: intervalMinutes = 60;
  }

  const newNextReview = new Date(now.getTime() + intervalMinutes * 60000).toISOString();
  return { last_review: newLastReview, next_review: newNextReview };
}

export default function FlashcardPracticePage() {
  const router = useRouter();
  const { setId } = router.query; // ?setId=...
  const role = 'student';

  const [setTitle, setSetTitle] = useState('Practice Session');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // practice state
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [mode, setMode] = useState('flashcards'); // flashcards | write | mc

  useEffect(() => {
    if (!setId) return;
    (async () => {
      setLoading(true);
      try {
        const { data: setData } = await supabase.from(SETS_TABLE).select('title').eq('id', setId).single();
        if (setData) setSetTitle(setData.title ? `Practice: ${setData.title}` : 'Practice Session');

        const { data: cardData } = await supabase
          .from(CARDS_TABLE)
          .select('*')
          .eq('set_id', setId)
          .order('position', { ascending: true });

        setCards(cardData || []);
      } catch (err) {
        console.error('Fetch cards error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [setId]);

  const currentCard = cards[index];

  const advanceCard = (opts = { auto: false }) => {
    setFlipped(false);
    setHasRated(false);
    setIndex(i => {
      const next = i + 1;
      if (next >= cards.length) {
        alert('Session complete — great job!');
        return i; // stay on last card
      }
      return next;
    });
  };

  // rate & SRS update
  const handleRate = async (rating) => {
    if (!currentCard || hasRated) return;
    setHasRated(true);
    try {
      const newDates = calculateNextReview(currentCard, rating);
      // update DB
      const { error } = await supabase.from(CARDS_TABLE).update(newDates).eq('id', currentCard.id);
      if (error) throw error;
      // update local state
      setCards(prev => prev.map(c => (c.id === currentCard.id ? { ...c, ...newDates } : c)));
    } catch (err) {
      console.error('SRS update failed', err);
    }
    // small delay to show feedback then advance
    setTimeout(() => advanceCard({ auto: true }), 300);
  };

  // Multiple Choice generator (simple: random definitions as distractors)
  const mcChoices = useMemo(() => {
    if (!currentCard || cards.length === 0) return [];
    const choices = new Set([currentCard.definition]);
    const pool = cards.filter(c => c.id !== currentCard.id).map(c => c.definition);
    while (choices.size < Math.min(4, cards.length)) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) choices.add(pick);
      if (pool.length === 0) break;
    }
    return shuffle(Array.from(choices));
  }, [currentCard, cards]);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Write mode checker (very simple fuzzy)
  const handleWriteCheck = (answer) => {
    if (!currentCard) return;
    const a = answer.trim().toLowerCase();
    const target = currentCard.definition.trim().toLowerCase();
    const correct = target.length > 0 && (a.includes(target.slice(0, Math.min(12, target.length))) || target.includes(a.slice(0, Math.min(12, a.length))));
    if (correct) {
      alert('Looks good — marked correct.');
      handleRate('Good');
    } else {
      alert('Not quite — marked as Hard for review.');
      handleRate('Hard');
    }
  };

  if (!setId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="Student" />
        <div className="max-w-7xl mx-auto flex pt-4">
          <Sidebar role={role} />
          <main className="flex-1 p-8">
            <p className="text-gray-500">No set selected. Open a set from the Flashcard Hub.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="Student" />
      <div className="max-w-7xl mx-auto flex pt-4">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{setTitle}</h1>
            <div className="flex gap-2">
              <button onClick={() => setMode('flashcards')} className={`px-3 py-1 rounded ${mode === 'flashcards' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Flashcards</button>
              <button onClick={() => setMode('write')} className={`px-3 py-1 rounded ${mode === 'write' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Write</button>
              <button onClick={() => setMode('mc')} className={`px-3 py-1 rounded ${mode === 'mc' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Multiple Choice</button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 bg-white rounded shadow">Loading cards...</div>
          ) : cards.length === 0 ? (
            <div className="p-6 bg-white rounded shadow">This set has no cards yet.</div>
          ) : (
            <>
              {/* Progress */}
              <p className="text-sm text-gray-500 mb-4">Card {index + 1} of {cards.length}</p>

              {/* Flashcard area */}
              {mode === 'flashcards' && currentCard && (
                <>
                  <div
                    onClick={() => setFlipped(!flipped)}
                    className="cursor-pointer max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow text-center border-t-8 border-indigo-500 mb-4"
                  >
                    {!flipped ? (
                      <h2 className="text-3xl font-bold">{currentCard.term}</h2>
                    ) : (
                      <p className="text-lg text-gray-700">{currentCard.definition}</p>
                    )}
                  </div>

                  {flipped && (
                    <div className="flex gap-3 justify-center mb-6">
                      <button onClick={() => handleRate('Hard')} className="px-6 py-2 bg-red-500 text-white rounded">Hard</button>
                      <button onClick={() => handleRate('Good')} className="px-6 py-2 bg-yellow-500 text-white rounded">Good</button>
                      <button onClick={() => handleRate('Easy')} className="px-6 py-2 bg-green-500 text-white rounded">Easy</button>
                      <button onClick={() => advanceCard()} className="px-6 py-2 bg-indigo-600 text-white rounded">Next</button>
                    </div>
                  )}
                </>
              )}

              {/* Multiple Choice */}
              {mode === 'mc' && currentCard && (
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
                  <h3 className="text-xl font-semibold mb-4">Select the correct definition for: <span className="italic">{currentCard.term}</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mcChoices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (choice === currentCard.definition) {
                            alert('Correct!');
                            handleRate('Good');
                          } else {
                            alert('Incorrect — try next time.');
                            handleRate('Hard');
                          }
                        }}
                        className="p-4 text-left bg-white rounded shadow"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Write Mode */}
              {mode === 'write' && currentCard && (
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
                  <h3 className="text-xl font-semibold mb-3">Write the definition for: <strong>{currentCard.term}</strong></h3>
                  <WriteBox onCheck={handleWriteCheck} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function WriteBox({ onCheck }) {
  const [answer, setAnswer] = useState('');
  return (
    <>
      <textarea value={answer} onChange={e => setAnswer(e.target.value)} className="w-full p-3 border rounded mb-3" rows={4} />
      <div className="flex gap-2">
        <button onClick={() => { onCheck(answer); setAnswer(''); }} className="px-4 py-2 bg-indigo-600 text-white rounded">Check</button>
        <button onClick={() => setAnswer('')} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
      </div>
    </>
  );
}
