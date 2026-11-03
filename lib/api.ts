import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import type { DocStatus, TenderDocument } from "@/types/document";

const MIN_LATENCY_MS = 300;
const MAX_LATENCY_MS = 800;
const RETRY_SUCCESS_RATE = 0.5;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function delay(): Promise<void> {
  const ms = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone(docs: TenderDocument[]): TenderDocument[] {
  return docs.map((doc) => structuredClone(doc));
}

let store: TenderDocument[] = clone(MOCK_DOCUMENTS);
let forceLoadError = false;

/** Lets a caller (e.g. an "?error=1" affordance) exercise the load error path. */
export function setForceLoadError(value: boolean): void {
  forceLoadError = value;
}

/** Restores the dataset to its seeded state. Used by tests. */
export function resetStore(): void {
  store = clone(MOCK_DOCUMENTS);
}

export async function getDocuments(): Promise<TenderDocument[]> {
  await delay();
  if (forceLoadError) {
    throw new ApiError(503, "The document service is temporarily unavailable.");
  }
  return clone(store);
}

export async function updateStatus(
  id: string,
  status: DocStatus,
): Promise<TenderDocument> {
  await delay();
  const doc = store.find((d) => d.id === id);
  if (!doc) throw new ApiError(404, `Document ${id} was not found.`);
  doc.status = status;
  if (status !== "failed") delete doc.error;
  return structuredClone(doc);
}

/** Re-queues a failed document. Randomly fails so rollback is exercised. */
export async function retry(id: string): Promise<TenderDocument> {
  await delay();
  const doc = store.find((d) => d.id === id);
  if (!doc) throw new ApiError(404, `Document ${id} was not found.`);
  if (Math.random() > RETRY_SUCCESS_RATE) {
    throw new ApiError(502, "The ingestion worker rejected the retry.");
  }
  doc.status = "pending";
  delete doc.error;
  return structuredClone(doc);
}
