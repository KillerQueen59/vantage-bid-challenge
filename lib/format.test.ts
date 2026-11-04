import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatFileSize,
  formatPages,
  formatTime,
} from "@/lib/format";

describe("formatFileSize", () => {
  it.each([
    { bytes: 500, expected: "500 B" },
    { bytes: 778240, expected: "760 KB" },
    { bytes: 1887437, expected: "1.8 MB" },
    { bytes: 13002342, expected: "12.4 MB" },
  ])("$bytes -> $expected", ({ bytes, expected }) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});

describe("formatDate (id-ID, WIB)", () => {
  it.each([
    { iso: "2026-11-03T10:12:00+07:00", expected: "03 Nov 2026" },
    { iso: "2026-10-29T11:11:00+07:00", expected: "29 Okt 2026" },
  ])("$iso -> $expected", ({ iso, expected }) => {
    expect(formatDate(iso)).toBe(expected);
  });

  it("renders in WIB regardless of the input offset", () => {
    // 2026-11-03T02:00Z is 09:00 WIB, same calendar day.
    expect(formatDate("2026-11-03T02:00:00Z")).toBe("03 Nov 2026");
  });
});

describe("formatTime / formatDateTime", () => {
  it("formats time with a colon in 24h", () => {
    expect(formatTime("2026-11-03T10:12:00+07:00")).toBe("10:12");
  });
  it("composes date, time and the WIB suffix", () => {
    expect(formatDateTime("2026-11-03T09:16:00+07:00")).toBe(
      "03 Nov 2026, 09:16 WIB",
    );
  });
});

describe("formatPages", () => {
  it.each([
    { ext: "PDF" as const, pages: 64, expected: "64 pages" },
    { ext: "PDF" as const, pages: 1, expected: "1 page" },
    { ext: "XLSX" as const, pages: 9, expected: "9 sheets" },
    { ext: "XLSX" as const, pages: 1, expected: "1 sheet" },
  ])("$ext $pages -> $expected", ({ ext, pages, expected }) => {
    expect(formatPages(ext, pages)).toBe(expected);
  });

  it("returns null when pages is undefined", () => {
    expect(formatPages("PDF", undefined)).toBeNull();
  });
});

describe("formatDuration", () => {
  it.each([
    { ms: 42000, expected: "42s" },
    { ms: 108000, expected: "1m 48s" },
    { ms: 70000, expected: "1m 10s" },
  ])("$ms -> $expected", ({ ms, expected }) => {
    expect(formatDuration(ms)).toBe(expected);
  });
});
