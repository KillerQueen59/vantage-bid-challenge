import type { DocCategory, DocStatus, TenderDocument } from "@/types/document";

export const PAGE_SIZE = 10;

export type StatusFilter = DocStatus | "all";
export type CategoryFilter = DocCategory | "all";

export interface DocumentFilters {
  q: string;
  status: StatusFilter;
  category: CategoryFilter;
}

export interface StatusCounts {
  all: number;
  ingested: number;
  pending: number;
  failed: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  pageCount: number;
  page: number;
}

export function countByStatus(documents: TenderDocument[]): StatusCounts {
  const counts: StatusCounts = { all: 0, ingested: 0, pending: 0, failed: 0 };
  for (const doc of documents) {
    counts.all += 1;
    counts[doc.status] += 1;
  }
  return counts;
}

export function filterDocuments(
  documents: TenderDocument[],
  filters: DocumentFilters,
): TenderDocument[] {
  const q = filters.q.trim().toLowerCase();
  return documents.filter((doc) => {
    if (filters.status !== "all" && doc.status !== filters.status) return false;
    if (filters.category !== "all" && doc.category !== filters.category)
      return false;
    if (q && !doc.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function isNarrowed(filters: DocumentFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.status !== "all" ||
    filters.category !== "all"
  );
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize = PAGE_SIZE,
): PagedResult<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    pageCount,
    page: current,
  };
}

export type SortField = "uploadedAt";
export type SortDir = "asc" | "desc";

export interface SortState {
  field: SortField;
  dir: SortDir;
}

export const DEFAULT_SORT: SortState = { field: "uploadedAt", dir: "desc" };

export function sortDocuments(
  documents: TenderDocument[],
  sort: SortState,
): TenderDocument[] {
  const factor = sort.dir === "asc" ? 1 : -1;
  return [...documents].sort((a, b) => {
    const left = a[sort.field];
    const right = b[sort.field];
    if (left < right) return -1 * factor;
    if (left > right) return 1 * factor;
    return 0;
  });
}
