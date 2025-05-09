'use client';

import { useState } from 'react';
import { Word } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordRowProps {
  word: Word;
  onToggleKnown: (rank: number) => Promise<void>;
}

export function WordRow({ 
  word, 
  onToggleKnown,
}: WordRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleKnown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await onToggleKnown(word.rank);
    } catch (err) {
      console.error('Error toggling known status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border-b last:border-0">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleExpand}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-8">{word.rank}.</span>
            <div className="font-medium truncate">{word.finnish}</div>
            {word.known && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                Known
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground truncate ml-8">{word.english}</div>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleKnown}
            disabled={isUpdating}
            className={cn(
              "h-8 w-8",
              word.known && "bg-primary/10 text-primary"
            )}
          >
            <Check className="h-4 w-4" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 bg-accent/30">
          {word.pronunciation && (
            <div className="text-sm">
              <span className="text-muted-foreground">Pronunciation: </span>
              {word.pronunciation}
            </div>
          )}
          {word.sentence ? (
            <div className="text-sm space-y-1">
              {word.sentence.split('\n').map((line, i) => (
                <p key={i} className="text-muted-foreground">{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No example sentence available</p>
          )}
          {word.relatedWords && word.relatedWords.length > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Related words: </span>
              {word.relatedWords.join(', ')}
            </div>
          )}
          {word.notes && (
            <div className="text-sm">
              <span className="text-muted-foreground">Notes: </span>
              {word.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 