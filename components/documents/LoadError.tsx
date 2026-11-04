import { CircleAlert } from "lucide-react";

interface LoadErrorProps {
  message?: string;
  onRetry: () => void;
}

export function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <div className="border-line bg-surface flex flex-col items-center gap-3 rounded-lg border px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="border-danger-line bg-danger-bg flex size-11 items-center justify-center rounded-[10px] border"
      >
        <CircleAlert className="text-danger size-5" />
      </span>
      <h2 className="text-[15px] font-semibold">List failed to load</h2>
      <p className="text-ink-600 max-w-[380px] text-sm">
        {message ?? "The document service did not respond (503)."} Please try
        again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="border-ink-900 bg-ink-900 hover:bg-ink-700 mt-1 h-8 rounded-md border px-3.5 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
