'use client';

import { useState, useEffect } from 'react';
import { WeekSelector } from '@/components/words/WeekSelector';
import { SearchBar } from '@/components/words/SearchBar';
import { WordRow } from '@/components/words/WordRow';
import { Word } from '@/lib/types';
import { getWords, toggleKnown, getWordsForWeek, searchWords, setWords } from '@/lib/storage';

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'known' | 'unknown'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWords = async () => {
      try {
        // First, try to load user progress
        const userWords = await getWords();
        
        // If no user progress exists, load the base word list and initialize storage
        if (userWords.length === 0) {
          const response = await fetch('/finnish_words_2000.json');
          if (!response.ok) throw new Error('Failed to load words');
          const allWords: Word[] = await response.json();
          
          // Initialize storage with base words
          await setWords(allWords);
          setWords(allWords);
        } else {
          setWords(userWords);
        }
      } catch (error) {
        console.error('Failed to load words:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const handleToggleKnown = async (rank: number) => {
    try {
      // Get all words first
      const allWords = await getWords();
      
      // Update the word's status
      const updatedWords = allWords.map(word => 
        word.rank === rank 
          ? { ...word, known: !word.known }
          : word
      );
      
      // Save to storage
      await setWords(updatedWords);
      
      // Update local state
      setWords(prev => 
        prev.map(word => 
          word.rank === rank 
            ? { ...word, known: !word.known }
            : word
        )
      );
    } catch (error) {
      console.error('Failed to toggle known status:', error);
    }
  };

  const handleSentenceUpdate = async (rank: number, sentence: string) => {
    try {
      // Get all words first
      const allWords = await getWords();
      
      // Update the word's sentence
      const updatedWords = allWords.map(word => 
        word.rank === rank
          ? { ...word, sentence }
          : word
      );
      
      // Save to storage
      await setWords(updatedWords);
      
      // Update local state
      setWords(prev =>
        prev.map(word =>
          word.rank === rank
            ? { ...word, sentence }
            : word
        )
      );
    } catch (error) {
      console.error('Failed to update sentence:', error);
    }
  };

  const filteredWords = words
    .filter(word => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          word.finnish.toLowerCase().includes(searchLower) ||
          word.english.toLowerCase().includes(searchLower) ||
          (word.sentence && word.sentence.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(word => {
      if (filter === 'known') return word.known;
      if (filter === 'unknown') return !word.known;
      return true;
    })
    .filter(word => word.week === currentWeek);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">Loading words...</p>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your vocabulary</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm pb-4 z-10">
          <WeekSelector
            currentWeek={currentWeek}
            totalWeeks={Math.ceil(words.length / 100)} // 20 words per day * 5 days per week
            onWeekChange={setCurrentWeek}
          />
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
        </div>

        <div className="space-y-1">
          {filteredWords.map(word => (
            <WordRow
              key={word.rank}
              word={word}
              onToggleKnown={handleToggleKnown}
              onSentenceUpdate={handleSentenceUpdate}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 