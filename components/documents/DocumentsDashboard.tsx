"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentDetailSheet } from "@/components/documents/DocumentDetailSheet";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { DocumentToolbar } from "@/components/documents/DocumentToolbar";
import { EmptyResult } from "@/components/documents/EmptyResult";
import { LoadError } from "@/components/documents/LoadError";
import { MobileFilterSheet } from "@/components/documents/MobileFilterSheet";
import { Pagination } from "@/components/documents/Pagination";
import { StatCards } from "@/components/documents/StatCards";
import { TableSkeleton } from "@/components/documents/TableSkeleton";
import { useDocumentFilters } from "@/hooks/useDocumentFilters";
import { useDocuments } from "@/hooks/useDocuments";
import { retry as apiRetry, updateStatus } from "@/lib/api";
import {
  countByStatus,
  filterDocuments,
  isNarrowed,
  paginate,
  sortDocuments,
} from "@/lib/filters";
import type { DocStatus, TenderDocument } from "@/types/document";

const STATUS_LABEL: Record<DocStatus, string> = {
  ingested: "Ingested",
  pending: "Pending",
  failed: "Failed",
};

export function DocumentsDashboard() {
  const searchParams = useSearchParams();
  const simulateError = searchParams.get("error") === "1";
  const { documents, isLoading, error, reload, mutate } = useDocuments({
    simulateError,
  });
  const {
    filters,
    sort,
    page,
    searchDraft,
    setSearchDraft,
    setStatus,
    setCategory,
    setSort,
    setPage,
    clearAll,
  } = useDocumentFilters();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allDocs = useMemo(() => documents ?? [], [documents]);
  const counts = useMemo(() => countByStatus(allDocs), [allDocs]);
  const visible = useMemo(
    () => sortDocuments(filterDocuments(allDocs, filters), sort),
    [allDocs, filters, sort],
  );
  const paged = paginate(visible, page);
  const activeDoc = allDocs.find((doc) => doc.id === drawerId) ?? null;
  const narrowed = isNarrowed(filters);

  const changeStatus = useCallback(
    async (doc: TenderDocument, status: DocStatus) => {
      if (doc.status === status) return;
      const snapshot = allDocs;
      mutate(
        allDocs.map((d) =>
          d.id === doc.id
            ? { ...d, status, error: status === "failed" ? d.error : undefined }
            : d,
        ),
        false,
      );
      try {
        await updateStatus(doc.id, status);
        toast.success("Status updated", {
          description: `${doc.name} is now marked ${STATUS_LABEL[status]}.`,
        });
      } catch {
        mutate(snapshot, false);
        toast.error("Could not update status", {
          description: `${doc.name} was left unchanged.`,
        });
      }
    },
    [allDocs, mutate],
  );

  const retryDocument = useCallback(
    async (doc: TenderDocument) => {
      const snapshot = allDocs;
      mutate(
        allDocs.map((d) =>
          d.id === doc.id
            ? { ...d, status: "pending" as DocStatus, error: undefined }
            : d,
        ),
        false,
      );
      try {
        await apiRetry(doc.id);
        toast.success("Retry queued", {
          description: `${doc.name} is back in the processing queue.`,
        });
      } catch {
        mutate(snapshot, false);
        toast.error("Retry failed", {
          description: `${doc.name} could not be re-queued. Try again.`,
        });
      }
    },
    [allDocs, mutate],
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-ink-900 text-lg font-semibold tracking-tight">
            Tender Documents
          </h1>
          <p className="text-ink-600 text-sm">
            Every file uploaded across active tenders, and where it is in the
            ingestion pipeline.
          </p>
        </div>
        <div className="text-ink-500 flex items-center gap-1.5 text-xs">
          <span>Synced 10:21 WIB</span>
          <button
            type="button"
            aria-label="Refresh"
            onClick={reload}
            className="text-ink-600 flex size-7 items-center justify-center rounded-md hover:bg-[#f0f2f5]"
          >
            <RefreshCw className="size-[15px]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {error ? (
        <LoadError message={error.message} onRetry={reload} />
      ) : isLoading && !documents ? (
        <TableSkeleton />
      ) : (
        <>
          <StatCards counts={counts} />
          <DocumentToolbar
            searchValue={searchDraft}
            onSearchChange={setSearchDraft}
            status={filters.status}
            counts={counts}
            onStatusChange={setStatus}
            category={filters.category}
            onCategoryChange={setCategory}
            narrowed={narrowed}
            onClear={clearAll}
            onOpenFilters={() => setFiltersOpen(true)}
          />
          <section
            aria-label="Documents"
            className="border-line bg-surface rounded-lg border"
          >
            {paged.items.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <DocumentTable
                    documents={paged.items}
                    onView={(doc) => setDrawerId(doc.id)}
                    onRetry={retryDocument}
                    onChangeStatus={changeStatus}
                    sort={sort}
                    onSortChange={setSort}
                  />
                </div>
                <div className="md:hidden">
                  {paged.items.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onView={() => setDrawerId(doc.id)}
                      onRetry={() => retryDocument(doc)}
                      onChangeStatus={(status) => changeStatus(doc, status)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyResult query={filters.q.trim()} onClear={clearAll} />
            )}
            <Pagination
              page={paged.page}
              pageCount={paged.pageCount}
              total={paged.total}
              onPageChange={setPage}
            />
          </section>
        </>
      )}

      <DocumentDetailSheet
        document={activeDoc}
        open={drawerId !== null}
        onOpenChange={(open) => {
          if (!open) setDrawerId(null);
        }}
        onRetry={retryDocument}
        onChangeStatus={changeStatus}
      />

      <MobileFilterSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        status={filters.status}
        category={filters.category}
        counts={counts}
        resultCount={visible.length}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onReset={clearAll}
      />
    </>
  );
}
