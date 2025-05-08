'use client';

import { useEffect, useState } from 'react';
import { useDailyWords } from '@/lib/hooks/useDailyWords';
import { Flashcard } from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LearnPage() {
  const router = useRouter();
  const {
    currentWord,
    currentIndex,
    totalWords,
    day,
    nextWord,
    previousWord,
    markAsKnown
  } = useDailyWords();

  const [isFlipped, setIsFlipped] = useState(false);

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading words...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 flex flex-col">
      {/* Progress indicator */}
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Day {day} • Word {currentIndex + 1} of {totalWords}
        </p>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <Flashcard
          word={currentWord}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
        <div className="max-w-md mx-auto flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={previousWord}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <Button
            variant="default"
            onClick={markAsKnown}
            disabled={currentWord.known}
          >
            {currentWord.known ? 'Known' : 'Mark as Known'}
          </Button>

          <Button
            variant="outline"
            onClick={nextWord}
            disabled={currentIndex === totalWords - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
} 