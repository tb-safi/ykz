"use client";

import { useState, useEffect } from "react";
import { Word } from "@/lib/types";
import { getWords } from "@/lib/storage";

export default function WordsPage() {
  const [words, setWordsState] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadWords = async () => {
      const allWords = await getWords();
      setWordsState(allWords);
    };
    loadWords();
  }, []);

  const filteredWords = words.filter(
    (word) =>
      word.finnish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Words</h1>
      <input
        type="text"
        placeholder="Search words..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid gap-4">
        {filteredWords.map((word) => (
          <div
            key={word.finnish}
            className="p-4 border rounded-lg bg-card text-card-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{word.finnish}</h3>
                <p className="text-muted-foreground">{word.english}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Week {word.week} • Day {word.day}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 