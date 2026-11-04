import { SearchX } from "lucide-react";

interface EmptyResultProps {
  query: string;
  onClear: () => void;
}

export function EmptyResult({ query, onClear }: EmptyResultProps) {
  const title = query
    ? `No documents match “${query}”`
    : "No documents in this view";

  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="border-line bg-subtle mb-1.5 flex size-11 items-center justify-center rounded-[10px] border"
      >
        <SearchX className="text-ink-600 size-5" />
      </span>
      <h2 className="text-[15px] font-semibold">{title}</h2>
      <p className="text-ink-600 max-w-[380px] text-sm">
        Check the spelling, or clear the status and category filters to see
        every document.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="border-line-input bg-surface text-ink-900 hover:bg-subtle mt-2.5 h-8 rounded-md border px-3.5 text-sm font-medium"
      >
        Clear filters
      </button>
    </div>
  );
}
