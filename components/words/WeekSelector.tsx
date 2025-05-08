import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
}

export function WeekSelector({ currentWeek, totalWeeks, onWeekChange }: WeekSelectorProps) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {weeks.map((week) => (
          <Button
            key={week}
            variant={currentWeek === week ? "default" : "outline"}
            size="sm"
            onClick={() => onWeekChange(week)}
            className="flex-shrink-0"
          >
            Week {week}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
} 