'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/lib/types';

interface FlashcardProps {
  word: Word;
  onFlip?: () => void;
}

export function Flashcard({ word, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div className="w-full h-[60vh] perspective-1000">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute w-full h-full backface-hidden bg-card rounded-xl shadow-lg p-6 flex items-center justify-center cursor-pointer"
          onClick={handleFlip}
        >
          <h2 className="text-4xl font-bold text-center">{word.finnish}</h2>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute w-full h-full backface-hidden bg-card rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer rotate-y-180"
          onClick={handleFlip}
        >
          <h3 className="text-2xl font-semibold mb-4">{word.english}</h3>
          {word.sentence && (
            <p className="text-lg text-muted-foreground text-center">{word.sentence}</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 