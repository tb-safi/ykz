import { useState, useEffect } from 'react';
import { getProgress, setProgress } from '../storage';

interface Progress {
  currentDay: number;
  lastReviewed: string;
}

export function useProgress() {
  const [progress, setProgressState] = useState<Progress>({
    currentDay: 1,
    lastReviewed: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const currentProgress = await getProgress();
        setProgressState(currentProgress);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  const updateProgress = async (newProgress: Progress) => {
    try {
      await setProgress(newProgress);
      setProgressState(newProgress);
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  return {
    progress,
    isLoading,
    updateProgress
  };
} 