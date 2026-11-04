# Vantedge Bid - Tender Documents

A tender document management dashboard: browse every file uploaded across active
tenders and see where each one sits in the ingestion pipeline. Built to a Claude
Design handoff as a frontend technical challenge.

**Live demo:** _<add Vercel URL here>_

## Features

- **Documents table** (desktop) and **card list** (mobile) with name, category,
  file size, status, and upload date/time (WIB).
- **Search** by document name (debounced, case-insensitive).
- **Filters** by status (Ingested / Pending / Failed) and category, with live counts.
- **Sorting** by upload date (click the Uploaded column header).
- **Pagination**, 10 per page.
- **Shareable URL state**: search, filters, sort, and page are synced to the query
  string, so refreshing or sharing a link restores the exact view.
- **Detail drawer**: metadata, a processing timeline (uploaded → processing →
  ingested/failed), and the error callout for failed documents.
- **Actions**: retry a failed document, or change a document's status. Both do an
  optimistic update with a toast and roll back if the (simulated) request fails.
- **Real states**: loading skeleton, empty result (with Clear filters), and a load
  error state - all driven by a fake API with latency.
- **Accessible**: keyboard navigable, labelled controls, status shown as icon + text
  (never colour alone), focus-trapped dialogs, and `Ctrl/Cmd + K` to focus search.
- **Responsive**: filters collapse into a bottom sheet and the detail view becomes a
  full-screen sheet on mobile.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict, no `any`)
- **Tailwind CSS v4** with design tokens from the handoff in `app/globals.css`
- **shadcn/ui** (Base UI primitives) + **lucide-react** icons
- **SWR** for data fetching and optimistic mutation
- **TanStack Table v8** for the table (columns, rendering, sorting)
- **Vitest** + **React Testing Library** for tests

No backend, database, or auth: `lib/api.ts` simulates a server with latency and
random failures.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest
```

To see the **load error** state, open `http://localhost:3000/?error=1`.
The **retry** action fails randomly (~50%), so you can see both the success toast
and the rollback.

## Folder structure

```
app/                     layout (fonts, Toaster), page (shell + dashboard), globals.css (tokens)
components/
  app-shell/             Sidebar, TopBar, AppShell
  documents/             StatCards, DocumentToolbar, StatusSegmented, CategorySelect,
                         DocumentTable, RowActions, DocumentCard, StatusBadge,
                         DocumentDetailSheet, StatusTimeline, ChangeStatusMenu,
                         Pagination, MobileFilterSheet, EmptyResult, LoadError,
                         TableSkeleton, DocumentsDashboard (client orchestrator)
  ui/                    shadcn/ui components
hooks/                   useDocuments (SWR), useDocumentFilters (URL-synced state)
lib/                     mock-data, api (fake), filters (pure), format (pure), utils
types/                   document.ts (TenderDocument contract)
```

## Design decisions & trade-offs

- **URL as the source of truth for view state.** Filters/search/sort/page live in the
  query string (`useDocumentFilters`). This makes views shareable and refresh-safe, and
  keeps the filtering logic as pure, testable functions in `lib/filters.ts`.
- **TanStack Table scoped to presentation + sorting.** Filtering, search, and pagination
  stay in `lib/filters.ts` (pure, URL-synced); the table handles column definitions,
  rendering, and the Uploaded sort. Pinned to **v8** (the stable, widely-used API) rather
  than the new v9 rewrite.
- **Dates use the `id-ID` locale** per the brief, so October renders as "Okt". The design
  artboards showed English month abbreviations; the brief's explicit locale requirement won.
  Times are kept colon-separated to match the design. All timestamps are formatted in
  `Asia/Jakarta` so output is deterministic regardless of where the code runs.
- **Data stored as machine values** (`sizeBytes`, ISO `uploadedAt`) and formatted via
  `lib/format.ts`, rather than the pre-formatted strings in the handoff - this is what
  makes the format helpers unit-testable.
- **"Change status" is a simulation.** The handoff flags manual status changes as risky
  (a user could mark a failed document "Ingested"). The challenge asked for it as an
  interactive action, so it is built as specified; in production it should be gated and
  audit-logged, or replaced with "Mark as resolved".
- **Top-bar global search is decorative** (it is app-wide search, out of scope). The
  functional search is the toolbar's "Search by document name". `Ctrl/Cmd + K` focuses it.
- **The `.dc.html` artboards are visual spec only** - rebuilt as real components; their
  canvas runtime was not copied.

## What I'd add with more time

- Virtualised rows for very large datasets.
- Column sorting on more fields and a multi-select bulk actions bar.
- A proper command palette behind `Ctrl/Cmd + K` instead of focusing the search field.
- E2E tests (Playwright) covering the drawer, retry rollback, and mobile bottom sheet.
- Server-backed data with real pagination and optimistic concurrency.
- Dark mode (tokens are light-only today).
