'use client';

import { motion } from "framer-motion";
import { Word } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface FlashcardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  isGenerating?: boolean;
}

export function Flashcard({ word, isFlipped, onFlip, isGenerating }: FlashcardProps) {
  return (
    <motion.div
      className="w-full h-full relative cursor-pointer touch-none"
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      style={{ transformStyle: "preserve-3d" }}
      onClick={onFlip}
    >
      <div
        className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center bg-card text-card-foreground shadow-lg ${
          isFlipped ? "hidden" : "block"
        }`}
      >
        <h2 className="text-3xl font-bold text-center">{word.finnish}</h2>
      </div>

      <div
        className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center bg-card text-card-foreground shadow-lg ${
          isFlipped ? "block" : "hidden"
        }`}
        style={{ transform: "rotateY(180deg)" }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">{word.english}</h2>
        {isGenerating ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating example sentence...</span>
          </div>
        ) : word.sentence ? (
          <p className="text-muted-foreground text-center text-lg italic">
            {word.sentence}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
} 