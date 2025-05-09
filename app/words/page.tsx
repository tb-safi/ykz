"use client";

import { useState, useEffect } from "react";
import { Word } from "@/lib/types";
import { getWords, setWords } from "@/lib/storage";
import { WordRow } from "@/components/words/WordRow";
import { SearchBar } from "@/components/words/SearchBar";
import { WeekSelector } from "@/components/words/WeekSelector";

export default function WordsPage() {
  const [words, setWordsState] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [filter, setFilter] = useState<"all" | "known" | "unknown">("all");

  useEffect(() => {
    const loadWords = async () => {
      const allWords = await getWords();
      setWordsState(allWords);
    };
    loadWords();
  }, []);

  const handleToggleKnown = async (rank: number) => {
    const updatedWords = words.map((word) =>
      word.rank === rank ? { ...word, known: !word.known } : word
    );
    await setWords(updatedWords);
    setWordsState(updatedWords);
  };

  const handleSentenceUpdate = async (rank: number, sentence: string) => {
    const updatedWords = words.map((word) =>
      word.rank === rank ? { ...word, sentence } : word
    );
    await setWords(updatedWords);
    setWordsState(updatedWords);
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
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4">All Words</h1>
        
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
                onSentenceUpdate={handleSentenceUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 