'use client';

import { useEffect, useState } from 'react';
import { getProgress, getKnownWords } from '@/lib/storage';
import Link from 'next/link';
import { Word } from '@/lib/types';

export default function Home() {
  const [progress, setProgress] = useState({ currentDay: 1, lastReviewed: '' });
  const [knownWords, setKnownWords] = useState<Word[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [progressData, words] = await Promise.all([
        getProgress(),
        getKnownWords()
      ]);
      setProgress(progressData);
      setKnownWords(words);
    };
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Tervetuloa!</h1>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="space-y-2">
            <p className="text-lg font-medium">Day {progress.currentDay} / 134</p>
            <p className="text-lg font-medium">Words Learned: {knownWords.length} / 2000</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/learn"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-center font-medium"
          >
            Start Today&apos;s Words
          </Link>
          <Link 
            href="/words"
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-center font-medium"
          >
            Browse All Words
          </Link>
        </div>

        <p className="text-lg text-muted-foreground">
          Let&apos;s start learning Finnish vocabulary!
        </p>
      </div>
    </main>
  );
}
