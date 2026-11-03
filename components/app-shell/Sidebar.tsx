import {
  Briefcase,
  ChevronsUpDown,
  FileText,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "#", current: false },
  { label: "Documents", icon: FileText, href: "#", current: true },
  { label: "Tenders", icon: Briefcase, href: "#", current: false },
  { label: "Settings", icon: SlidersHorizontal, href: "#", current: false },
] as const;

interface SidebarProps {
  documentCount: number;
}

export function Sidebar({ documentCount }: SidebarProps) {
  return (
    <nav
      aria-label="Primary"
      className="border-line bg-surface hidden w-[232px] shrink-0 flex-col gap-[18px] border-r px-3 pt-3.5 pb-4 md:flex"
    >
      <div className="flex h-7 items-center px-2 text-[15px] tracking-tight">
        <span className="text-ink-900 font-bold">Vantedge</span>
        <span className="text-brand ml-1 font-semibold">Bid</span>
      </div>

      <button
        type="button"
        className="border-line bg-surface flex w-full items-center gap-2.5 rounded-md border px-2 py-1.5 text-left hover:bg-[#f0f2f5]"
      >
        <span
          aria-hidden="true"
          className="bg-ink-900 flex size-6 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-semibold text-white"
        >
          KM
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-ink-900 truncate text-sm font-medium">
            PT Karya Mandiri
          </span>
          <span className="text-2xs text-ink-500">Workspace</span>
        </span>
        <ChevronsUpDown className="text-ink-500 size-3.5" aria-hidden="true" />
      </button>

      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, href, current }) => (
          <li key={label}>
            <a
              href={href}
              aria-current={current ? "page" : undefined}
              className={
                current
                  ? "bg-muted text-ink-900 flex h-8 items-center gap-2.5 rounded-md px-2 text-[13.5px] font-medium"
                  : "text-ink-600 flex h-8 items-center gap-2.5 rounded-md px-2 text-[13.5px] hover:bg-[#f0f2f5]"
              }
            >
              <Icon
                className={current ? "text-brand size-4" : "size-4"}
                aria-hidden="true"
              />
              {label}
              {current && (
                <span className="text-2xs text-ink-600 ml-auto font-mono">
                  {documentCount}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
