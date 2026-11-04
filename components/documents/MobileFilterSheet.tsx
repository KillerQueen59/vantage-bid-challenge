"use client";

import { Check } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CategoryFilter, StatusCounts, StatusFilter } from "@/lib/filters";
import { DOC_CATEGORIES } from "@/types/document";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ingested", label: "Ingested" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

interface MobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: StatusFilter;
  category: CategoryFilter;
  counts: StatusCounts;
  resultCount: number;
  onStatusChange: (value: StatusFilter) => void;
  onCategoryChange: (value: CategoryFilter) => void;
  onReset: () => void;
}

export function MobileFilterSheet({
  open,
  onOpenChange,
  status,
  category,
  counts,
  resultCount,
  onStatusChange,
  onCategoryChange,
  onReset,
}: MobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-0 rounded-t-xl p-0"
      >
        <SheetHeader className="border-line-soft border-b px-5 py-4">
          <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-5">
          <fieldset className="flex flex-col gap-1">
            <legend className="text-ink-600 mb-1 text-xs font-semibold tracking-[0.02em]">
              Status
            </legend>
            {STATUS_OPTIONS.map((option) => {
              const active = status === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onStatusChange(option.value)}
                  className="text-ink-900 hover:bg-subtle flex min-h-11 items-center justify-between rounded-md px-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    {option.label}
                    <span className="text-2xs text-ink-500 font-mono">
                      {counts[option.value]}
                    </span>
                  </span>
                  {active && (
                    <Check className="text-brand size-4" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-ink-600 mb-1 text-xs font-semibold tracking-[0.02em]">
              Category
            </legend>
            <div className="flex flex-wrap gap-2">
              {(["all", ...DOC_CATEGORIES] as CategoryFilter[]).map((item) => {
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onCategoryChange(item)}
                    className={
                      active
                        ? "border-brand-line bg-brand-soft text-brand flex min-h-11 items-center rounded-full border px-3 text-sm font-medium"
                        : "border-line-input bg-surface text-ink-700 flex min-h-11 items-center rounded-full border px-3 text-sm"
                    }
                  >
                    {item === "all" ? "All categories" : item}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="border-line-soft flex items-center gap-3 border-t px-5 py-4">
          <button
            type="button"
            onClick={onReset}
            className="border-line-input bg-surface text-ink-900 min-h-11 flex-1 rounded-md border px-4 text-sm font-medium"
          >
            Reset
          </button>
          <SheetClose
            render={
              <button
                type="button"
                className="border-ink-900 bg-ink-900 min-h-11 flex-1 rounded-md border px-4 text-sm font-medium text-white"
              >
                Show {resultCount} results
              </button>
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
