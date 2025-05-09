export interface Word {
  rank: number;
  finnish: string;
  english: string;
  sentence?: string;
  known: boolean;
  score: number;
  lastReviewed?: string;
  day: number;
  week: number;
  confidence: number;        // 1-5 scale
  reviewCount: number;       // How many times reviewed
  wordType?: string;         // noun, verb, etc.
  notes?: string;           // Personal notes
  relatedWords?: string[];  // Related words
  pronunciation?: string;   // Pronunciation guide
}

export interface DailyWords {
  words: Word[];
  currentIndex: number;
  day: number;
}

export interface WordProgress {
  totalWords: number;
  knownWords: number;
  averageConfidence: number;
  weeklyGoal: number;
  currentStreak: number;
  lastStudied: string;
}

export interface Progress {
  currentDay: number;
  lastReviewed: string;
} 