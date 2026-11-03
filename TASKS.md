# Vantedge Bid — Tender Documents Dashboard: Tasks

Built to the Claude Design handoff. One task at a time: after each, run lint +
typecheck (+ tests once they exist), tick the box, report changes + verify steps +
a suggested conventional commit message, then wait for "next".

- [x] **T01** chore: scaffold Next.js + TS strict + Tailwind v4 + ESLint/Prettier, clean boilerplate
- [x] **T02** chore: init shadcn/ui (only needed components) + design tokens in globals.css `@theme` + IBM Plex fonts
- [ ] **T03** feat: `TenderDocument` types + 34 realistic mock documents (26 ingested / 5 pending / 3 failed)
- [ ] **T04** feat: fake API layer (300–800ms latency, random retry failures) + format helpers (size, date)
- [ ] **T05** feat: app shell layout (sidebar, top bar), responsive
- [ ] **T06** feat: StatusBadge + DocumentTable (desktop) rendering mock data
- [ ] **T07** feat: summary StatCards (Total / Ingested / Pending / Failed) with share bars
- [ ] **T08** feat: pure filter functions + debounced search + status & category filters
- [ ] **T09** feat: sync search/filter/page state to URL query params + pagination
- [ ] **T10** feat: DocumentDetailSheet (metadata, status timeline, error message)
- [ ] **T11** feat: actions — change status, retry Failed — optimistic update, toast, rollback
- [ ] **T12** feat: mobile — DocumentCard list, filters in bottom sheet, full-screen detail
- [ ] **T13** feat: loading skeleton, empty result (Clear filters), error state
- [ ] **T14** fix: accessibility pass (keyboard nav, labels, focus, contrast)
- [ ] **T15** test: Vitest + RTL — filters, format helpers, search+filter integration test
- [ ] **T16** docs: README (overview, live demo placeholder, stack, run locally, structure, trade-offs, next)
- [ ] **T17** chore: final check — `npm run build` passes, no console errors, ready for Vercel
