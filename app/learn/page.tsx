"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWordsForWeek } from "@/lib/storage";
import { Word } from "@/lib/types";
import { motion, PanInfo } from "framer-motion";

export default function LearnPage() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      const weekWords = await getWordsForWeek(currentWeek);
      setWords(weekWords);
      setCurrentIndex(0);
      setIsFlipped(false);
    };
    loadWords();
  }, [currentWeek]);

  const generateSentence = async (word: Word) => {
    if (word.sentence || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      
      if (!response.ok) throw new Error("Failed to generate sentence");
      
      const data = await response.json();
      const updatedWords = [...words];
      updatedWords[currentIndex] = { ...word, sentence: data.sentence };
      setWords(updatedWords);
    } catch (error) {
      console.error("Error generating sentence:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !words[currentIndex].sentence) {
      generateSentence(words[currentIndex]);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        handlePrevious();
      } else if (info.offset.x < 0 && currentIndex < words.length - 1) {
        handleNext();
      }
    }
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading words...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Week {currentWeek}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              Next Week
            </Button>
          </div>
        </div>

        <motion.div 
          className="relative aspect-[3/4] mb-6"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          <Flashcard
            word={words[currentIndex]}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            isGenerating={isGenerating}
          />
        </motion.div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} of {words.length}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 