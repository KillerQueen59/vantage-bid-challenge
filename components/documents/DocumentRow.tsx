import { Ellipsis, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { formatDate, formatFileSize, formatTime } from "@/lib/format";
import type { TenderDocument } from "@/types/document";

interface DocumentRowProps {
  document: TenderDocument;
}

export function DocumentRow({ document }: DocumentRowProps) {
  const isFailed = document.status === "failed";

  return (
    <tr className="border-line-soft hover:bg-subtle border-b last:border-0">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="border-line-input bg-subtle text-ink-600 flex h-8 w-7 shrink-0 items-end justify-center rounded-sm border pb-1 font-mono text-[8.5px] leading-[10px] font-semibold"
          >
            {document.ext}
          </span>
          <div className="flex min-w-0 flex-col">
            <button
              type="button"
              title={document.name}
              className="text-ink-900 block max-w-full truncate text-left text-[13.5px] font-medium"
            >
              {document.name}
            </button>
            <span className="text-ink-500 truncate text-xs">
              {document.tender.label}
            </span>
          </div>
        </div>
      </td>
      <td className="text-ink-700 truncate px-4 py-3">{document.category}</td>
      <td className="text-ink-600 px-4 py-3 text-right font-mono text-xs whitespace-nowrap">
        {formatFileSize(document.sizeBytes)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-ink-700">{formatDate(document.uploadedAt)}</div>
        <div className="text-ink-500 text-xs">
          {formatTime(document.uploadedAt)} WIB
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={document.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          {isFailed && (
            <button
              type="button"
              aria-label={`Retry ${document.name}`}
              className="border-line-input bg-surface text-ink-900 hover:bg-subtle flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-medium"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Retry
            </button>
          )}
          <button
            type="button"
            className="border-line-input bg-surface text-ink-900 hover:bg-subtle h-7 rounded-md border px-2.5 text-[12.5px] font-medium whitespace-nowrap"
          >
            View details
          </button>
          <button
            type="button"
            aria-label={`More actions for ${document.name}`}
            className="text-ink-600 flex size-7 items-center justify-center rounded-md hover:bg-[#f0f2f5]"
          >
            <Ellipsis className="size-4" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}
