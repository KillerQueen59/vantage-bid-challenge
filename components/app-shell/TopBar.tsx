import { Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="border-line bg-surface flex h-14 shrink-0 items-center gap-4 border-b px-4 md:px-8">
      <div className="relative min-w-0 flex-1 md:max-w-[440px]">
        <label htmlFor="global-search" className="sr-only">
          Search everything
        </label>
        <Search
          className="text-ink-500 pointer-events-none absolute top-2 left-2.5 size-4"
          aria-hidden="true"
        />
        <input
          id="global-search"
          type="search"
          placeholder="Search tenders, documents, vendors…"
          className="border-line bg-subtle text-ink-900 placeholder:text-ink-500 focus-visible:ring-brand h-8 w-full rounded-md border pr-16 pl-[34px] text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <span
          aria-hidden="true"
          className="border-line-input bg-surface text-2xs text-ink-500 absolute top-[7px] right-2 hidden rounded-sm border px-[5px] font-mono sm:block"
        >
          Ctrl K
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="text-ink-600 flex size-8 items-center justify-center rounded-md hover:bg-[#f0f2f5]"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Account: Rina Setiawati"
          className="flex h-9 items-center gap-2 rounded-md py-0 pr-2 pl-1 hover:bg-[#f0f2f5]"
        >
          <span
            aria-hidden="true"
            className="text-2xs text-brand-hover flex size-7 items-center justify-center rounded-full bg-[#e4e8fb] font-semibold"
          >
            RS
          </span>
          <span className="text-ink-900 hidden text-sm font-medium sm:block">
            Rina Setiawati
          </span>
        </button>
      </div>
    </header>
  );
}
