// components/Flashcard.js
import React from 'react';

const Flashcard = ({ card, isFlipped, setIsFlipped }) => {
  if (!card) return null;

  return (
    <div 
      className="w-full max-w-xl h-80 perspective-1000 cursor-pointer mb-6"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl flex items-center justify-center p-8 border-t-8 border-indigo-500">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium">TERM</p>
            <h2 className="text-3xl font-bold text-gray-900">{card.term}</h2>
          </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden bg-indigo-100 rounded-2xl shadow-xl flex items-center justify-center p-8 border-t-8 border-indigo-700 transform rotate-y-180">
          <div className="text-center">
            <p className="text-sm text-indigo-700 mb-2 font-medium">DEFINITION</p>
            <p className="text-xl text-gray-800">{card.definition}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
