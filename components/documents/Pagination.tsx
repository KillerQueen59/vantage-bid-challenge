import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE } from "@/lib/filters";

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  pageCount,
  total,
  onPageChange,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const rangeLabel = total === 0 ? "0" : `${start}–${end}`;

  const navButton =
    "flex size-[30px] items-center justify-center rounded-md border border-line bg-surface text-ink-900 disabled:text-[#a3aab7]";

  return (
    <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5">
      <span className="text-ink-600 text-[12.5px]">
        Showing <b className="text-ink-900 font-semibold">{rangeLabel}</b> of{" "}
        <b className="text-ink-900 font-semibold">{total}</b>
      </span>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={navButton}
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((n) => {
          const current = n === page;
          return (
            <button
              key={n}
              type="button"
              aria-label={`Page ${n}`}
              aria-current={current ? "page" : undefined}
              onClick={() => onPageChange(n)}
              className={
                current
                  ? "border-ink-900 bg-ink-900 flex h-[30px] min-w-[30px] items-center justify-center rounded-md border px-1.5 font-mono text-xs font-medium text-white"
                  : "border-line-input bg-surface text-ink-900 flex h-[30px] min-w-[30px] items-center justify-center rounded-md border px-1.5 font-mono text-xs font-medium"
              }
            >
              {n}
            </button>
          );
        })}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={navButton}
        >
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
