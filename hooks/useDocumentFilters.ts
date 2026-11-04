"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_SORT,
  type CategoryFilter,
  type DocumentFilters,
  type SortState,
  type StatusFilter,
} from "@/lib/filters";
import { DOC_CATEGORIES, DOC_STATUSES } from "@/types/document";

const SEARCH_DEBOUNCE_MS = 300;

function parseStatus(value: string | null): StatusFilter {
  return value && (DOC_STATUSES as readonly string[]).includes(value)
    ? (value as StatusFilter)
    : "all";
}

function parseCategory(value: string | null): CategoryFilter {
  return value && (DOC_CATEGORIES as readonly string[]).includes(value)
    ? (value as CategoryFilter)
    : "all";
}

function parseSort(value: string | null): SortState {
  if (value === "uploadedAt:asc") return { field: "uploadedAt", dir: "asc" };
  if (value === "uploadedAt:desc") return { field: "uploadedAt", dir: "desc" };
  return DEFAULT_SORT;
}

function serializeSort(sort: SortState): string {
  return `${sort.field}:${sort.dir}`;
}

interface CommitInput {
  q?: string;
  status?: StatusFilter;
  category?: CategoryFilter;
  sort?: SortState;
  page?: number;
}

export function useDocumentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const status = parseStatus(searchParams.get("status"));
  const category = parseCategory(searchParams.get("category"));
  const sort = parseSort(searchParams.get("sort"));
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const filters: DocumentFilters = { q, status, category };

  const commit = useCallback(
    (next: CommitInput) => {
      const params = new URLSearchParams(searchParams.toString());
      const setOrDelete = (key: string, value: string, fallback: string) => {
        if (value === fallback) params.delete(key);
        else params.set(key, value);
      };

      if (next.q !== undefined) setOrDelete("q", next.q.trim(), "");
      if (next.status !== undefined) setOrDelete("status", next.status, "all");
      if (next.category !== undefined)
        setOrDelete("category", next.category, "all");
      if (next.sort !== undefined)
        setOrDelete(
          "sort",
          serializeSort(next.sort),
          serializeSort(DEFAULT_SORT),
        );

      const filterChanged =
        next.q !== undefined ||
        next.status !== undefined ||
        next.category !== undefined ||
        next.sort !== undefined;
      const targetPage = next.page ?? (filterChanged ? 1 : page);
      setOrDelete("page", String(targetPage), "1");

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [page, pathname, router, searchParams],
  );

  const [searchDraft, setSearchDraft] = useState(q);
  const [syncedQ, setSyncedQ] = useState(q);

  // Adjust-state-during-render: when the URL's q changes externally (back /
  // forward navigation, Clear filters), pull it into the local draft.
  if (q !== syncedQ) {
    setSyncedQ(q);
    setSearchDraft(q);
  }

  useEffect(() => {
    if (searchDraft.trim() === q) return;
    const timer = setTimeout(
      () => commit({ q: searchDraft }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [searchDraft, q, commit]);

  const clearAll = useCallback(() => {
    setSearchDraft("");
    commit({ q: "", status: "all", category: "all" });
  }, [commit]);

  return {
    filters,
    sort,
    page,
    searchDraft,
    setSearchDraft,
    setStatus: (value: StatusFilter) => commit({ status: value }),
    setCategory: (value: CategoryFilter) => commit({ category: value }),
    setSort: (value: SortState) => commit({ sort: value }),
    setPage: (value: number) => commit({ page: value }),
    clearAll,
  };
}
