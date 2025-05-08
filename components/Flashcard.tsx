'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Word } from '@/lib/types';

interface FlashcardProps {
  word: Word;
}

export function Flashcard({ word }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-48 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden p-6 rounded-lg bg-card text-card-foreground border shadow-sm ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <h3 className="text-2xl font-bold text-center">{word.finnish}</h3>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden p-6 rounded-lg bg-card text-card-foreground border shadow-sm rotate-y-180 ${
            isFlipped ? "" : "rotate-y-180"
          }`}
        >
          <h3 className="text-2xl font-bold text-center mb-2">{word.english}</h3>
          {word.sentence && (
            <p className="text-sm text-muted-foreground text-center">
              {word.sentence}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
} 