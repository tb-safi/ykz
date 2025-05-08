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
}

export interface DailyWords {
  words: Word[];
  currentIndex: number;
  day: number;
} 