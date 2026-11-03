import type { DocExt } from "@/types/document";

const JAKARTA_TZ = "Asia/Jakarta";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: JAKARTA_TZ,
});

// Time uses a colon separator (HH:mm) to match the design; id-ID would render
// a dot. Dates follow the id-ID locale as required by the brief.
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: JAKARTA_TZ,
});

function normalize(value: string): string {
  return value.replace(/ | /g, " ");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return normalize(dateFmt.format(new Date(iso)));
}

export function formatTime(iso: string): string {
  return normalize(timeFmt.format(new Date(iso)));
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTime(iso)} WIB`;
}

export function formatPages(ext: DocExt, pages?: number): string | null {
  if (pages == null) return null;
  const unit = ext === "XLSX" ? "sheet" : "page";
  return `${pages} ${unit}${pages === 1 ? "" : "s"}`;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}
