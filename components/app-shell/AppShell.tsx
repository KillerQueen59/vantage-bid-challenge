import type { ReactNode } from "react";
import { Sidebar } from "@/components/app-shell/Sidebar";
import { TopBar } from "@/components/app-shell/TopBar";

interface AppShellProps {
  documentCount: number;
  children: ReactNode;
}

export function AppShell({ documentCount, children }: AppShellProps) {
  return (
    <div className="bg-canvas text-ink-900 flex min-h-dvh">
      <Sidebar documentCount={documentCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col gap-5 px-4 py-6 md:px-8 md:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
