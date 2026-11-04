import { Suspense } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { DocumentsDashboard } from "@/components/documents/DocumentsDashboard";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";

export default function Home() {
  return (
    <AppShell documentCount={MOCK_DOCUMENTS.length}>
      <Suspense>
        <DocumentsDashboard />
      </Suspense>
    </AppShell>
  );
}
