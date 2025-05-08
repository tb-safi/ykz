"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flashcard } from "@/components/Flashcard";
import { getWordsForWeek } from "@/lib/storage";

export default function LearnPage() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const words = getWordsForWeek(currentWeek);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Learn Week {currentWeek}</h1>
      <div className="grid gap-6">
        {words.map((word) => (
          <Flashcard key={word.finnish} word={word} />
        ))}
      </div>
    </div>
  );
} 