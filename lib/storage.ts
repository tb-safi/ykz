import { Word } from './types';

interface Progress {
  currentDay: number;
  lastReviewed: string;
}

interface UserProgress {
  words: Word[];
  lastUpdated: string | null;
}

export async function getProgress(): Promise<Progress> {
  try {
    const response = await fetch('/user_progress.json');
    const data: UserProgress = await response.json();
    
    if (!data.lastUpdated) {
      return { currentDay: 1, lastReviewed: new Date().toISOString().split('T')[0] };
    }

    return {
      currentDay: 1, // This will be calculated based on the last reviewed date
      lastReviewed: data.lastUpdated
    };
  } catch (error) {
    console.error('Failed to load progress:', error);
    return { currentDay: 1, lastReviewed: new Date().toISOString().split('T')[0] };
  }
}

export async function setProgress(progress: Progress): Promise<void> {
  try {
    const response = await fetch('/api/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastUpdated: progress.lastReviewed
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
  } catch (error) {
    console.error('Failed to save progress:', error);
    throw error;
  }
}

export async function getWords(): Promise<Word[]> {
  try {
    const response = await fetch('/user_progress.json');
    const data: UserProgress = await response.json();
    return data.words;
  } catch (error) {
    console.error('Failed to load words:', error);
    return [];
  }
}

export async function setWords(words: Word[]): Promise<void> {
  try {
    const response = await fetch('/api/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        words,
        lastUpdated: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update words');
    }
  } catch (error) {
    console.error('Failed to save words:', error);
    throw error;
  }
}

export async function getKnownWords(): Promise<Word[]> {
  const words = await getWords();
  return words.filter(word => word.known);
}

export async function toggleKnown(rank: number): Promise<void> {
  const words = await getWords();
  const updatedWords = words.map(word => 
    word.rank === rank 
      ? { ...word, known: !word.known }
      : word
  );
  await setWords(updatedWords);
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