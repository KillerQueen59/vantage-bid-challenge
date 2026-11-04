"use client";

import { useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Upload } from "lucide-react";
import { CategorySelect } from "@/components/documents/CategorySelect";
import { StatusSegmented } from "@/components/documents/StatusSegmented";
import type { CategoryFilter, StatusCounts, StatusFilter } from "@/lib/filters";

interface DocumentToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  counts: StatusCounts;
  onStatusChange: (value: StatusFilter) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  narrowed: boolean;
  onClear: () => void;
  onOpenFilters: () => void;
}

export function DocumentToolbar({
  searchValue,
  onSearchChange,
  status,
  counts,
  onStatusChange,
  category,
  onCategoryChange,
  narrowed,
  onClear,
  onOpenFilters,
}: DocumentToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[180px] flex-1 md:flex-[0_1_280px]">
        <label htmlFor="document-search" className="sr-only">
          Search by document name
        </label>
        <Search
          className="text-ink-500 pointer-events-none absolute top-[9px] left-2.5 size-[15px]"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="document-search"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by document name"
          className="border-line-input bg-surface text-ink-900 placeholder:text-ink-500 focus-visible:ring-brand h-[34px] w-full rounded-md border pr-2.5 pl-8 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onOpenFilters}
        className="border-line-input bg-surface text-ink-900 flex h-[34px] items-center gap-2 rounded-md border px-3 text-sm font-medium md:hidden"
      >
        <SlidersHorizontal className="size-[15px]" aria-hidden="true" />
        Filters
        {narrowed && (
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        )}
      </button>

      <div className="hidden items-center gap-2.5 md:flex">
        <StatusSegmented
          value={status}
          counts={counts}
          onChange={onStatusChange}
        />
        <CategorySelect value={category} onChange={onCategoryChange} />
        {narrowed && (
          <button
            type="button"
            onClick={onClear}
            className="text-brand hover:bg-brand-soft h-[34px] rounded-md px-2.5 text-sm"
          >
            Clear filters
          </button>
        )}
      </div>

      <button
        type="button"
        className="border-ink-900 bg-ink-900 hover:bg-ink-700 ml-auto flex h-[34px] items-center gap-2 rounded-md border px-3.5 text-sm font-medium text-white"
      >
        <Upload className="size-[15px]" aria-hidden="true" />
        <span className="hidden sm:inline">Upload document</span>
        <span className="sm:hidden">Upload</span>
      </button>
    </div>
  );
}
