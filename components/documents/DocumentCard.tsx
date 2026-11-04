import { Download, Ellipsis, RefreshCw } from "lucide-react";
import { ChangeStatusMenu } from "@/components/documents/ChangeStatusMenu";
import { StatusBadge } from "@/components/documents/StatusBadge";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatFileSize, formatTime } from "@/lib/format";
import type { DocStatus, TenderDocument } from "@/types/document";

interface DocumentCardProps {
  document: TenderDocument;
  onView: () => void;
  onRetry: () => void;
  onChangeStatus: (status: DocStatus) => void;
}

export function DocumentCard({
  document,
  onView,
  onRetry,
  onChangeStatus,
}: DocumentCardProps) {
  return (
    <div className="border-line-soft flex flex-col gap-3 border-b p-4 last:border-0">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="border-line-input bg-subtle text-ink-600 flex h-8 w-7 shrink-0 items-end justify-center rounded-sm border pb-1 font-mono text-[8.5px] leading-[10px] font-semibold"
        >
          {document.ext}
        </span>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onView}
            className="text-ink-900 line-clamp-2 text-left text-sm font-medium"
          >
            {document.name}
          </button>
          <div className="text-ink-500 mt-0.5 truncate text-xs">
            {document.category} · {formatFileSize(document.sizeBytes)}
          </div>
        </div>
        <ChangeStatusMenu
          status={document.status}
          onChange={onChangeStatus}
          trigger={
            <button
              type="button"
              aria-label={`More actions for ${document.name}`}
              className="text-ink-600 flex size-11 items-center justify-center rounded-md hover:bg-[#f0f2f5]"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </button>
          }
        >
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Download aria-hidden="true" />
            Download
          </DropdownMenuItem>
        </ChangeStatusMenu>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={document.status} />
          <span className="text-ink-500 text-xs">
            {formatTime(document.uploadedAt)} WIB
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {document.status === "failed" && (
            <button
              type="button"
              onClick={onRetry}
              className="border-line-input bg-surface text-ink-900 flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-[12.5px] font-medium"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Retry
            </button>
          )}
          <button
            type="button"
            onClick={onView}
            className="border-line-input bg-surface text-ink-900 min-h-11 rounded-md border px-3 text-[12.5px] font-medium"
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
}
