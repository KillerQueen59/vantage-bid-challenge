import {
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  Clock,
  FileText,
} from "lucide-react";
import type { StatusCounts } from "@/lib/filters";

interface StatCardsProps {
  counts: StatusCounts;
}

function pct(part: number, total: number, decimals = 0): number {
  if (total === 0) return 0;
  const factor = 10 ** decimals;
  return Math.round((part / total) * 100 * factor) / factor;
}

function ShareBar({ value, color }: { value: number; color: string }) {
  return (
    <span className="bg-muted h-1 flex-1 overflow-hidden rounded-full">
      <span
        className="block h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </span>
  );
}

export function StatCards({ counts }: StatCardsProps) {
  const ingestedRate = pct(counts.ingested, counts.all, 1);

  return (
    <section
      aria-label="Summary"
      className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4 [&>article]:min-w-[220px] [&>article]:snap-start sm:[&>article]:min-w-0"
    >
      <article className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border px-[18px] py-4">
        <div className="text-ink-600 flex items-center gap-2 text-[12.5px] font-medium">
          <FileText className="size-[15px]" aria-hidden="true" />
          Total documents
        </div>
        <div className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
          {counts.all}
        </div>
        <div className="text-ink-600 flex items-center gap-1 text-xs">
          <ArrowUpRight className="size-3" aria-hidden="true" />
          <span>
            <b className="text-ink-900 font-semibold">+6</b> this week
          </span>
        </div>
      </article>

      <article className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border px-[18px] py-4">
        <div className="text-ink-600 flex items-center gap-2 text-[12.5px] font-medium">
          <CircleCheck
            className="text-success size-[15px]"
            aria-hidden="true"
          />
          Ingested
        </div>
        <div className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
          {counts.ingested}
        </div>
        <div className="text-ink-600 flex items-center gap-2.5 text-xs">
          <ShareBar value={ingestedRate} color="var(--color-success-bar)" />
          <span className="whitespace-nowrap">
            <b className="text-ink-900 font-semibold">{ingestedRate}%</b>{" "}
            success rate
          </span>
        </div>
      </article>

      <article className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border px-[18px] py-4">
        <div className="text-ink-600 flex items-center gap-2 text-[12.5px] font-medium">
          <Clock
            className="vb-pulse text-warning size-[15px]"
            aria-hidden="true"
          />
          Pending
        </div>
        <div className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
          {counts.pending}
        </div>
        <div className="text-ink-600 flex items-center gap-2.5 text-xs">
          <ShareBar
            value={pct(counts.pending, counts.all)}
            color="var(--color-warning-bar)"
          />
          <span className="whitespace-nowrap">
            Oldest in queue <b className="text-ink-900 font-semibold">20 min</b>
          </span>
        </div>
      </article>

      <article className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border px-[18px] py-4">
        <div className="text-ink-600 flex items-center gap-2 text-[12.5px] font-medium">
          <CircleAlert className="text-danger size-[15px]" aria-hidden="true" />
          Failed
        </div>
        <div className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
          {counts.failed}
        </div>
        <div className="text-ink-600 flex items-center gap-2.5 text-xs">
          <ShareBar
            value={pct(counts.failed, counts.all)}
            color="var(--color-danger-bar)"
          />
          <span className="whitespace-nowrap">
            <b className="text-ink-900 font-semibold">{counts.failed}</b> need
            action
          </span>
        </div>
      </article>
    </section>
  );
}
