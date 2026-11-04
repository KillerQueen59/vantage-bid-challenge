import type { StatusCounts, StatusFilter } from "@/lib/filters";

const SEGMENTS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ingested", label: "Ingested" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

interface StatusSegmentedProps {
  value: StatusFilter;
  counts: StatusCounts;
  onChange: (value: StatusFilter) => void;
}

export function StatusSegmented({
  value,
  counts,
  onChange,
}: StatusSegmentedProps) {
  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="flex gap-0.5 rounded-[7px] bg-[#eaecf0] p-0.5"
    >
      {SEGMENTS.map((segment) => {
        const active = value === segment.value;
        return (
          <button
            key={segment.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(segment.value)}
            className={
              active
                ? "bg-surface text-ink-900 flex h-[30px] items-center gap-1.5 rounded-[5px] px-2.5 text-sm font-semibold shadow-[0_1px_2px_rgba(20,23,31,0.12),0_0_0_1px_rgba(20,23,31,0.04)]"
                : "text-ink-700 flex h-[30px] items-center gap-1.5 rounded-[5px] px-2.5 text-sm font-medium"
            }
          >
            {segment.label}
            <span className="text-2xs text-ink-600 font-mono">
              {counts[segment.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
