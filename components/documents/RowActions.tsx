import { Download, Ellipsis, RefreshCw } from "lucide-react";
import { ChangeStatusMenu } from "@/components/documents/ChangeStatusMenu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { DocStatus, TenderDocument } from "@/types/document";

interface RowActionsProps {
  document: TenderDocument;
  onView: () => void;
  onRetry: () => void;
  onChangeStatus: (status: DocStatus) => void;
}

export function RowActions({
  document,
  onView,
  onRetry,
  onChangeStatus,
}: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {document.status === "failed" && (
        <button
          type="button"
          onClick={onRetry}
          aria-label={`Retry ${document.name}`}
          className="border-line-input bg-surface text-ink-900 hover:bg-subtle flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-medium"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
      <button
        type="button"
        onClick={onView}
        className="border-line-input bg-surface text-ink-900 hover:bg-subtle h-7 rounded-md border px-2.5 text-[12.5px] font-medium whitespace-nowrap"
      >
        View details
      </button>
      <ChangeStatusMenu
        status={document.status}
        onChange={onChangeStatus}
        trigger={
          <button
            type="button"
            aria-label={`More actions for ${document.name}`}
            className="text-ink-600 flex size-7 items-center justify-center rounded-md hover:bg-[#f0f2f5]"
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
  );
}
