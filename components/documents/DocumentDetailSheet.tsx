import { ChevronUp, CircleAlert, Download, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChangeStatusMenu } from "@/components/documents/ChangeStatusMenu";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { StatusTimeline } from "@/components/documents/StatusTimeline";
import { formatFileSize, formatPages } from "@/lib/format";
import type { DocStatus, TenderDocument } from "@/types/document";

interface DocumentDetailSheetProps {
  document: TenderDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry: (document: TenderDocument) => void;
  onChangeStatus: (document: TenderDocument, status: DocStatus) => void;
}

function MetaItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-ink-500 text-xs">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

export function DocumentDetailSheet({
  document,
  open,
  onOpenChange,
  onRetry,
  onChangeStatus,
}: DocumentDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton
        className="!w-full !max-w-[480px] gap-0 p-0"
      >
        {document && (
          <div className="flex h-full flex-col">
            <div className="border-line-soft flex flex-col gap-3 border-b px-6 pt-[18px] pb-4">
              <div className="flex items-start gap-3 pr-8">
                <span
                  aria-hidden="true"
                  className="border-line-input bg-subtle text-ink-600 flex h-[42px] w-9 flex-none items-end justify-center rounded-[5px] border pb-[5px] font-mono text-[10px] font-semibold"
                >
                  {document.ext}
                </span>
                <SheetTitle className="min-w-0 flex-1 text-base font-semibold [overflow-wrap:anywhere]">
                  {document.name}
                </SheetTitle>
              </div>
              <SheetDescription className="sr-only">
                Metadata and processing status for {document.name}
              </SheetDescription>
              <div className="flex flex-wrap items-center gap-2.5 pl-12">
                <StatusBadge status={document.status} />
                <span className="text-ink-500 text-xs">
                  {document.category} · {formatFileSize(document.sizeBytes)}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pt-5 pb-6">
              {document.error && (
                <div
                  role="alert"
                  className="border-danger-line bg-danger-bg flex gap-2.5 rounded-lg border p-3"
                >
                  <CircleAlert
                    className="text-danger mt-0.5 size-4 flex-none"
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="text-danger-strong text-sm font-semibold">
                      Failed at {document.error.stage}
                    </div>
                    <div className="text-ink-700 text-sm">
                      {document.error.message}
                    </div>
                    <div className="text-danger-strong font-mono text-[11.5px]">
                      {document.error.code} · Attempt {document.error.attempt}{" "}
                      of {document.error.maxAttempts}
                    </div>
                  </div>
                </div>
              )}

              <section className="flex flex-col gap-3">
                <h3 className="text-ink-600 text-xs font-semibold tracking-[0.02em]">
                  Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-5 gap-y-3.5">
                  <MetaItem label="Category">{document.category}</MetaItem>
                  <MetaItem label="Tender">{document.tender.label}</MetaItem>
                  <MetaItem label="File size">
                    {formatFileSize(document.sizeBytes)}
                    {document.pages
                      ? ` · ${formatPages(document.ext, document.pages)}`
                      : ""}
                  </MetaItem>
                  <MetaItem label="Format">{document.ext}</MetaItem>
                  <MetaItem label="Uploaded by">{document.uploadedBy}</MetaItem>
                  <MetaItem label="Document ID">
                    <span className="font-mono text-xs">{document.id}</span>
                  </MetaItem>
                </dl>
              </section>

              <section className="flex flex-col gap-3.5">
                <h3 className="text-ink-600 text-xs font-semibold tracking-[0.02em]">
                  Processing timeline
                </h3>
                <StatusTimeline document={document} />
              </section>
            </div>

            <div className="border-line-soft flex items-center gap-2 border-t px-6 py-3.5">
              <button
                type="button"
                className="border-line-input bg-surface text-ink-900 hover:bg-subtle flex h-[34px] items-center gap-1.5 rounded-md border px-3 text-sm font-medium"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Download
              </button>
              <ChangeStatusMenu
                status={document.status}
                onChange={(status) => onChangeStatus(document, status)}
                itemPrefix="Mark as "
                side="top"
                trigger={
                  <button
                    type="button"
                    className="border-line-input bg-surface text-ink-900 hover:bg-subtle flex h-[34px] items-center gap-1.5 rounded-md border px-3 text-sm font-medium"
                  >
                    Change status
                    <ChevronUp className="size-3.5" aria-hidden="true" />
                  </button>
                }
              />
              {document.status === "failed" && (
                <button
                  type="button"
                  onClick={() => onRetry(document)}
                  className="border-ink-900 bg-ink-900 hover:bg-ink-700 ml-auto flex h-[34px] items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium text-white"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  Retry ingestion
                </button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
