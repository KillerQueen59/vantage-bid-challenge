import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryFilter } from "@/lib/filters";
import { DOC_CATEGORIES } from "@/types/document";

interface CategorySelectProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as CategoryFilter)}
    >
      <SelectTrigger
        aria-label="Filter by category"
        className="border-line-input bg-surface text-ink-900 h-[34px] text-sm"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {DOC_CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
