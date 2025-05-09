import { Word, Progress } from './types';

const STORAGE_KEYS = {
  WORDS: 'yki_words',
  PROGRESS: 'yki_progress'
};

export async function getWords(): Promise<Word[]> {
  try {
    // First try to get from localStorage
    const savedWords = localStorage.getItem(STORAGE_KEYS.WORDS);
    if (savedWords) {
      return JSON.parse(savedWords);
    }

    // If not in localStorage, fetch from the JSON file
    const response = await fetch('/finnish_words_2000.json');
    const words: Word[] = await response.json();
    
    // Save to localStorage for future use
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
    return words;
  } catch (error) {
    console.error('Error loading words:', error);
    return [];
  }
}

export async function setWords(words: Word[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving words:', error);
  }
}

export async function getProgress(): Promise<Progress> {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    
    // Default progress if none exists
    const defaultProgress: Progress = {
      currentDay: 1,
      lastReviewed: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(defaultProgress));
    return defaultProgress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return { currentDay: 1, lastReviewed: new Date().toISOString() };
  }
}

export async function setProgress(progress: Progress): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export async function getKnownWords(): Promise<Word[]> {
  const words = await getWords();
  return words.filter(word => word.known);
}

export async function getWordsForWeek(week: number): Promise<Word[]> {
  const words = await getWords();
  return words.filter(word => word.week === week);
}

export async function searchWords(query: string): Promise<Word[]> {
  const words = await getWords();
  const searchLower = query.toLowerCase();
  
  return words.filter(word => 
    word.finnish.toLowerCase().includes(searchLower) ||
    word.english.toLowerCase().includes(searchLower) ||
    (word.sentence && word.sentence.toLowerCase().includes(searchLower))
  );
}

export async function updateWordSentence(rank: number, sentence: string): Promise<boolean> {
  try {
    const words = await getWords();
    const updatedWords = words.map(word => 
      word.rank === rank ? { ...word, sentence } : word
    );
    await setWords(updatedWords);
    return true;
  } catch (error) {
    console.error('Failed to update word sentence:', error);
    return false;
  }
} 