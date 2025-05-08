'use client';

import { useEffect, useState } from 'react';
import { getProgress, getKnownWords } from '@/lib/storage';
import Link from 'next/link';

export default function Home() {
  const [progress, setProgress] = useState(getProgress());
  const [knownWords, setKnownWords] = useState<number[]>([]);

  useEffect(() => {
    setProgress(getProgress());
    setKnownWords(getKnownWords());
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Tervetuloa!</h1>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="space-y-2">
            <p className="text-lg font-medium">Day {progress.currentDay} / 134</p>
            <p className="text-lg font-medium">XP: {progress.xp}</p>
            <p className="text-lg font-medium">Words Learned: {knownWords.length} / 2000</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/learn"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-center font-medium"
          >
            Start Today's Words
          </Link>
          <Link 
            href="/words"
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-center font-medium"
          >
            Browse All Words
          </Link>
        </div>
      </div>
    </main>
  );
}
