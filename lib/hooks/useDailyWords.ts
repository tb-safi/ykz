import { useState, useEffect } from 'react';
import { Word, DailyWords } from '../types';
import { getProgress, getWords, setWords } from '../storage';

const WORDS_PER_DAY = 20;

export function useDailyWords() {
  const [dailyWords, setDailyWords] = useState<DailyWords>({
    words: [],
    currentIndex: 0,
    day: 1
  });

  useEffect(() => {
    const loadWords = async () => {
      try {
        // Get base word list
        const baseResponse = await fetch('/finnish_words_2000.json');
        const baseWords: Word[] = await baseResponse.json();
        
        // Get user's saved progress
        const savedWords = await getWords();
        const progress = await getProgress();
        
        // Merge saved words with base words
        const mergedWords = baseWords.map(baseWord => {
          const savedWord = savedWords.find(w => w.rank === baseWord.rank);
          return savedWord || baseWord;
        });
        
        // Calculate the slice for today's words
        const start = (progress.currentDay - 1) * WORDS_PER_DAY;
        const end = start + WORDS_PER_DAY;
        const todayWords = mergedWords.slice(start, end);

        // If we have no saved words yet, initialize with base words
        if (savedWords.length === 0) {
          await setWords(mergedWords);
        }

        setDailyWords({
          words: todayWords,
          currentIndex: 0,
          day: progress.currentDay
        });
      } catch (error) {
        console.error('Failed to load words:', error);
      }
    };

    loadWords();
  }, []);

  const nextWord = () => {
    if (dailyWords.currentIndex < dailyWords.words.length - 1) {
      setDailyWords(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    }
  };

  const previousWord = () => {
    if (dailyWords.currentIndex > 0) {
      setDailyWords(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
    }
  };

  const markAsKnown = async () => {
    try {
      // Get all words from storage
      const allWords = await getWords();
      
      // If no words in storage, get from base list
      const baseWords = allWords.length === 0 ? await fetch('/finnish_words_2000.json').then(res => res.json()) : allWords;
      
      // Update the current word's status
      const updatedWords = baseWords.map((word: Word) => 
        word.rank === dailyWords.words[dailyWords.currentIndex].rank
          ? { ...word, known: true, lastReviewed: new Date().toISOString().split('T')[0] }
          : word
      );

      // Save to storage
      await setWords(updatedWords);

      // Update local state
      setDailyWords(prev => ({
        ...prev,
        words: prev.words.map(word => 
          word.rank === dailyWords.words[dailyWords.currentIndex].rank
            ? { ...word, known: true }
            : word
        )
      }));

      // Move to next word
      nextWord();
    } catch (error) {
      console.error('Failed to mark word as known:', error);
    }
  };

  return {
    currentWord: dailyWords.words[dailyWords.currentIndex],
    currentIndex: dailyWords.currentIndex,
    totalWords: dailyWords.words.length,
    day: dailyWords.day,
    nextWord,
    previousWord,
    markAsKnown
  };
} 