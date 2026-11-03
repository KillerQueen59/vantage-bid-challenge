export const DOC_STATUSES = ["ingested", "pending", "failed"] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];

export const DOC_CATEGORIES = [
  "Kualifikasi",
  "Teknis",
  "Administrasi",
  "Penawaran Harga",
  "BoQ",
] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];

export const DOC_EXTS = ["PDF", "DOCX", "XLSX"] as const;
export type DocExt = (typeof DOC_EXTS)[number];

export interface TenderRef {
  id: string;
  label: string;
}

export interface DocProcessing {
  startedAt?: string;
  durationMs?: number;
  finishedAt?: string;
}

export interface DocError {
  stage: string;
  message: string;
  code: string;
  attempt: number;
  maxAttempts: number;
}

export interface TenderDocument {
  id: string;
  name: string;
  ext: DocExt;
  category: DocCategory;
  sizeBytes: number;
  pages?: number;
  uploadedAt: string;
  uploadedBy: string;
  tender: TenderRef;
  status: DocStatus;
  processing?: DocProcessing;
  error?: DocError;
}
