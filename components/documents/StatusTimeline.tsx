import { Check, Clock, X } from "lucide-react";
import { formatDateTime, formatDuration } from "@/lib/format";
import type { TenderDocument } from "@/types/document";

type StepState = "done" | "active" | "failed" | "todo";

interface Step {
  label: string;
  stateLabel: string;
  meta: string;
  state: StepState;
}

const TONE: Record<StepState, string> = {
  done: "text-success",
  active: "text-warning",
  failed: "text-danger",
  todo: "text-ink-500",
};

function buildSteps(document: TenderDocument): Step[] {
  const uploaded: Step = {
    label: "Uploaded",
    stateLabel: "Completed",
    meta: `${formatDateTime(document.uploadedAt)} · ${document.uploadedBy}`,
    state: "done",
  };

  if (document.status === "ingested") {
    const duration = document.processing?.durationMs
      ? ` · ${formatDuration(document.processing.durationMs)}`
      : "";
    const finishedAt = document.processing?.finishedAt
      ? formatDateTime(document.processing.finishedAt)
      : formatDateTime(document.uploadedAt);
    return [
      uploaded,
      {
        label: "Processing",
        stateLabel: "Completed",
        meta: `Text extraction, parsing & classification${duration}`,
        state: "done",
      },
      {
        label: "Ingested",
        stateLabel: "Completed",
        meta: `${finishedAt} · searchable in tender workspace`,
        state: "done",
      },
    ];
  }

  if (document.status === "pending") {
    return [
      uploaded,
      {
        label: "Processing",
        stateLabel: "In progress",
        meta: "Queued for text extraction · est. 4 min",
        state: "active",
      },
      {
        label: "Ingested",
        stateLabel: "Not started",
        meta: "Waiting for processing to finish",
        state: "todo",
      },
    ];
  }

  const stage = document.error?.stage ?? "parsing";
  const attempt = document.error
    ? `Attempt ${document.error.attempt} of ${document.error.maxAttempts}`
    : "Attempt 1 of 3";
  return [
    uploaded,
    {
      label: "Processing",
      stateLabel: "Stopped",
      meta: `Stopped during ${stage}`,
      state: "failed",
    },
    {
      label: "Failed",
      stateLabel: attempt,
      meta: document.error?.code ?? "",
      state: "failed",
    },
  ];
}

function Node({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <span className="border-success-line bg-success-bg flex size-[22px] items-center justify-center rounded-full border">
        <Check className="text-success size-3" aria-hidden="true" />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="border-warning-line bg-warning-bg flex size-[22px] items-center justify-center rounded-full border">
        <Clock className="vb-pulse text-warning size-3" aria-hidden="true" />
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span className="border-danger-line bg-danger-bg flex size-[22px] items-center justify-center rounded-full border">
        <X className="text-danger size-3" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span className="bg-surface size-[22px] rounded-full border-[1.5px] border-dashed border-[#b5bcc8]" />
  );
}

function lineColor(next: Step | undefined): string {
  if (!next) return "transparent";
  if (next.state === "done") return "var(--color-success-line)";
  if (next.state === "failed") return "var(--color-danger-line)";
  return "var(--color-line)";
}

interface StatusTimelineProps {
  document: TenderDocument;
}

export function StatusTimeline({ document }: StatusTimelineProps) {
  const steps = buildSteps(document);
  return (
    <ol className="list-none">
      {steps.map((step, index) => {
        const next = steps[index + 1];
        return (
          <li key={step.label} className="flex gap-3">
            <div className="flex w-[22px] flex-none flex-col items-center">
              <Node state={step.state} />
              {index < steps.length - 1 && (
                <span
                  className="my-1 min-h-6 w-0.5 flex-1 rounded-full"
                  style={{ backgroundColor: lineColor(next) }}
                />
              )}
            </div>
            <div className="min-w-0 pb-[18px]">
              <div className="flex items-baseline gap-2">
                <span className="text-[13.5px] font-semibold">
                  {step.label}
                </span>
                <span className={`text-xs font-medium ${TONE[step.state]}`}>
                  {step.stateLabel}
                </span>
              </div>
              <div className="text-ink-600 text-[12.5px]">{step.meta}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
