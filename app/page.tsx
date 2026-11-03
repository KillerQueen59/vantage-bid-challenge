import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app-shell/AppShell";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";

export default function Home() {
  const documents = MOCK_DOCUMENTS;

  return (
    <AppShell documentCount={documents.length}>
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
            className="text-ink-600 flex size-7 items-center justify-center rounded-md hover:bg-[#f0f2f5]"
          >
            <RefreshCw className="size-[15px]" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section
        aria-label="Documents"
        className="border-line bg-surface rounded-lg border"
      >
        <DocumentTable documents={documents} />
      </section>
    </AppShell>
  );
}
