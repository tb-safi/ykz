"use client";

import { useState, useEffect } from "react";
import { Word, WordProgress } from "@/lib/types";
import { getWords, setWords } from "@/lib/storage";
import { WordRow } from "@/components/words/WordRow";
import { SearchBar } from "@/components/words/SearchBar";
import { WeekSelector } from "@/components/words/WeekSelector";

export default function WordsPage() {
  const [words, setWordsState] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [filter, setFilter] = useState<"all" | "known" | "unknown">("all");
  const [progress, setProgress] = useState<WordProgress>({
    totalWords: 0,
    knownWords: 0,
    averageConfidence: 0,
    weeklyGoal: 20,
    currentStreak: 0,
    lastStudied: new Date().toISOString()
  });

  useEffect(() => {
    const loadWords = async () => {
      const allWords = await getWords();
      setWordsState(allWords);
      
      // Calculate progress
      const knownWords = allWords.filter(w => w.known).length;
      const avgConfidence = allWords.reduce((acc, w) => acc + (w.confidence || 0), 0) / allWords.length;
      
      setProgress({
        totalWords: allWords.length,
        knownWords,
        averageConfidence: avgConfidence,
        weeklyGoal: 20,
        currentStreak: calculateStreak(allWords),
        lastStudied: new Date().toISOString()
      });
    };
    loadWords();
  }, []);

  const calculateStreak = (words: Word[]): number => {
    // Simple streak calculation - can be enhanced
    const today = new Date().toISOString().split('T')[0];
    const lastReviewed = words
      .filter(w => w.lastReviewed)
      .map(w => w.lastReviewed!.split('T')[0])
      .sort()
      .pop();
    
    return lastReviewed === today ? 1 : 0;
  };

  const handleToggleKnown = async (rank: number) => {
    const updatedWords = words.map((word) =>
      word.rank === rank ? { ...word, known: !word.known, lastReviewed: new Date().toISOString() } : word
    );
    await setWords(updatedWords);
    setWordsState(updatedWords);
    updateProgress(updatedWords);
  };

  const handleConfidenceUpdate = async (rank: number, confidence: number) => {
    const updatedWords = words.map((word) =>
      word.rank === rank ? { ...word, confidence, lastReviewed: new Date().toISOString() } : word
    );
    await setWords(updatedWords);
    setWordsState(updatedWords);
    updateProgress(updatedWords);
  };

  const handleSentenceUpdate = async (rank: number, sentence: string) => {
    const updatedWords = words.map((word) =>
      word.rank === rank ? { ...word, sentence } : word
    );
    await setWords(updatedWords);
    setWordsState(updatedWords);
  };

  const updateProgress = (updatedWords: Word[]) => {
    const knownWords = updatedWords.filter(w => w.known).length;
    const avgConfidence = updatedWords.reduce((acc, w) => acc + (w.confidence || 0), 0) / updatedWords.length;
    
    setProgress(prev => ({
      ...prev,
      knownWords,
      averageConfidence: avgConfidence,
      currentStreak: calculateStreak(updatedWords)
    }));
  };

  const filteredWords = words
    .filter((word) => word.week === currentWeek)
    .filter((word) => {
      const matchesSearch =
        word.finnish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.english.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "all") return matchesSearch;
      if (filter === "known") return matchesSearch && word.known;
      if (filter === "unknown") return matchesSearch && !word.known;
      return matchesSearch;
    });

  const totalWeeks = Math.max(...words.map((word) => word.week), 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Vocabulary Learning</h1>
        
        
        <div className="space-y-4">
          <SearchBar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filter}
            onFilterChange={setFilter}
          />

          <WeekSelector
            currentWeek={currentWeek}
            totalWeeks={totalWeeks}
            onWeekChange={setCurrentWeek}
          />

          <div className="border rounded-lg divide-y bg-card">
            {filteredWords.map((word) => (
              <WordRow
                key={word.finnish}
                word={word}
                onToggleKnown={handleToggleKnown}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 