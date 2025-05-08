import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: "all" | "known" | "unknown";
  onFilterChange: (filter: "all" | "known" | "unknown") => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: SearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search words..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex space-x-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "known" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("known")}
        >
          Known
        </Button>
        <Button
          variant={filter === "unknown" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("unknown")}
        >
          Unknown
        </Button>
      </div>
    </div>
  );
} 