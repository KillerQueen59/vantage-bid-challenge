"use client";

import useSWR from "swr";
import { getDocuments } from "@/lib/api";
import type { TenderDocument } from "@/types/document";

export interface UseDocumentsResult {
  documents: TenderDocument[] | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
  mutate: (
    data?: TenderDocument[] | Promise<TenderDocument[]>,
    shouldRevalidate?: boolean,
  ) => void;
}

export function useDocuments({
  simulateError = false,
} = {}): UseDocumentsResult {
  const { data, error, isLoading, mutate } = useSWR<TenderDocument[], Error>(
    ["documents", simulateError],
    ([, fail]) => getDocuments({ simulateError: fail as boolean }),
    { revalidateOnFocus: false },
  );

  return {
    documents: data ?? null,
    isLoading,
    error: error ?? null,
    reload: () => void mutate(),
    mutate: (next, shouldRevalidate = false) => {
      void mutate(next, { revalidate: shouldRevalidate });
    },
  };
}
