import { CircleAlert, CircleCheck, Clock } from "lucide-react";
import type { DocStatus } from "@/types/document";

const STATUS_CONFIG = {
  ingested: {
    label: "Ingested",
    icon: CircleCheck,
    className: "border-success-line bg-success-bg text-success",
    pulse: false,
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "border-warning-line bg-warning-bg text-warning",
    pulse: true,
  },
  failed: {
    label: "Failed",
    icon: CircleAlert,
    className: "border-danger-line bg-danger-bg text-danger",
    pulse: false,
  },
} as const satisfies Record<
  DocStatus,
  {
    label: string;
    icon: typeof CircleCheck;
    className: string;
    pulse: boolean;
  }
>;

interface StatusBadgeProps {
  status: DocStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, icon: Icon, className, pulse } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex h-[22px] items-center gap-[5px] rounded-full border pr-2 pl-1.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      <Icon
        className={`size-3.5 ${pulse ? "vb-pulse" : ""}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
