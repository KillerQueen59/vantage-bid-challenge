import { describe, expect, it } from "vitest";
import {
  countByStatus,
  filterDocuments,
  isNarrowed,
  paginate,
  sortDocuments,
  type DocumentFilters,
} from "@/lib/filters";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import type { TenderDocument } from "@/types/document";

function doc(overrides: Partial<TenderDocument>): TenderDocument {
  return {
    id: "VB-DOC-0001",
    name: "Sample Document.pdf",
    ext: "PDF",
    category: "Teknis",
    sizeBytes: 1024,
    uploadedAt: "2026-11-01T10:00:00+07:00",
    uploadedBy: "Tester",
    tender: { id: "PKT-01", label: "Paket 01" },
    status: "ingested",
    ...overrides,
  };
}

const SAMPLE: TenderDocument[] = [
  doc({
    id: "a",
    name: "RKS Gedung B.docx",
    category: "Teknis",
    status: "pending",
  }),
  doc({
    id: "b",
    name: "BoQ Jalan Tol.xlsx",
    category: "BoQ",
    status: "failed",
  }),
  doc({
    id: "c",
    name: "BoQ Gedung B.xlsx",
    category: "BoQ",
    status: "ingested",
  }),
  doc({
    id: "d",
    name: "Pakta Integritas.pdf",
    category: "Administrasi",
    status: "ingested",
  }),
];

const base: DocumentFilters = { q: "", status: "all", category: "all" };

describe("countByStatus", () => {
  it("counts the seeded dataset as 26 ingested / 5 pending / 3 failed", () => {
    expect(countByStatus(MOCK_DOCUMENTS)).toEqual({
      all: 34,
      ingested: 26,
      pending: 5,
      failed: 3,
    });
  });
});

describe("filterDocuments", () => {
  const cases: {
    name: string;
    filters: DocumentFilters;
    expectedIds: string[];
  }[] = [
    {
      name: "no filters returns all",
      filters: base,
      expectedIds: ["a", "b", "c", "d"],
    },
    {
      name: "status filter",
      filters: { ...base, status: "ingested" },
      expectedIds: ["c", "d"],
    },
    {
      name: "category filter",
      filters: { ...base, category: "BoQ" },
      expectedIds: ["b", "c"],
    },
    {
      name: "case-insensitive name search",
      filters: { ...base, q: "boq" },
      expectedIds: ["b", "c"],
    },
    {
      name: "trims whitespace in search",
      filters: { ...base, q: "  gedung  " },
      expectedIds: ["a", "c"],
    },
    {
      name: "status and category combine (AND)",
      filters: { ...base, status: "ingested", category: "BoQ" },
      expectedIds: ["c"],
    },
    {
      name: "no matches",
      filters: { ...base, q: "nonexistent" },
      expectedIds: [],
    },
  ];

  it.each(cases)("$name", ({ filters, expectedIds }) => {
    expect(filterDocuments(SAMPLE, filters).map((d) => d.id)).toEqual(
      expectedIds,
    );
  });
});

describe("isNarrowed", () => {
  it.each([
    { filters: base, expected: false },
    { filters: { ...base, q: "x" }, expected: true },
    { filters: { ...base, q: "   " }, expected: false },
    { filters: { ...base, status: "failed" as const }, expected: true },
    { filters: { ...base, category: "BoQ" as const }, expected: true },
  ])("$filters -> $expected", ({ filters, expected }) => {
    expect(isNarrowed(filters)).toBe(expected);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 34 }, (_, i) => i + 1);

  it("returns the first page", () => {
    const result = paginate(items, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.items[0]).toBe(1);
    expect(result.total).toBe(34);
    expect(result.pageCount).toBe(4);
  });

  it("returns a middle page", () => {
    expect(paginate(items, 2, 10).items[0]).toBe(11);
  });

  it("clamps an out-of-range page to the last page", () => {
    const result = paginate(items, 99, 10);
    expect(result.page).toBe(4);
    expect(result.items).toEqual([31, 32, 33, 34]);
  });

  it("clamps page below 1", () => {
    expect(paginate(items, 0, 10).page).toBe(1);
  });
});

describe("sortDocuments", () => {
  it("sorts by uploadedAt descending", () => {
    const docs = [
      doc({ id: "old", uploadedAt: "2026-10-01T10:00:00+07:00" }),
      doc({ id: "new", uploadedAt: "2026-11-01T10:00:00+07:00" }),
    ];
    expect(
      sortDocuments(docs, { field: "uploadedAt", dir: "desc" }).map(
        (d) => d.id,
      ),
    ).toEqual(["new", "old"]);
  });

  it("sorts ascending and does not mutate the input", () => {
    const docs = [
      doc({ id: "new", uploadedAt: "2026-11-01T10:00:00+07:00" }),
      doc({ id: "old", uploadedAt: "2026-10-01T10:00:00+07:00" }),
    ];
    const sorted = sortDocuments(docs, { field: "uploadedAt", dir: "asc" });
    expect(sorted.map((d) => d.id)).toEqual(["old", "new"]);
    expect(docs[0].id).toBe("new");
  });
});
