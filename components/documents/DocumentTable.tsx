"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { RowActions } from "@/components/documents/RowActions";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { formatDate, formatFileSize, formatTime } from "@/lib/format";
import type { SortState } from "@/lib/filters";
import type { DocStatus, TenderDocument } from "@/types/document";

interface ColumnMetaX {
  headClass?: string;
  cellClass?: string;
}

interface DocumentTableProps {
  documents: TenderDocument[];
  onView: (document: TenderDocument) => void;
  onRetry: (document: TenderDocument) => void;
  onChangeStatus: (document: TenderDocument, status: DocStatus) => void;
  sort: SortState;
  onSortChange: (sort: SortState) => void;
}

const SORT_COLUMN_ID = "uploaded";
const columnHelper = createColumnHelper<TenderDocument>();

export function DocumentTable({
  documents,
  onView,
  onRetry,
  onChangeStatus,
  sort,
  onSortChange,
}: DocumentTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: "Document name",
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="border-line-input bg-subtle text-ink-600 flex h-8 w-7 shrink-0 items-end justify-center rounded-sm border pb-1 font-mono text-[8.5px] leading-[10px] font-semibold"
              >
                {doc.ext}
              </span>
              <div className="flex min-w-0 flex-col">
                <button
                  type="button"
                  onClick={() => onView(doc)}
                  title={doc.name}
                  className="text-ink-900 block max-w-full truncate text-left text-[13.5px] font-medium"
                >
                  {doc.name}
                </button>
                <span className="text-ink-500 truncate text-xs">
                  {doc.tender.label}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("category", {
        header: "Category",
        enableSorting: false,
        meta: { headClass: "w-[148px]", cellClass: "text-ink-700 truncate" },
      }),
      columnHelper.accessor("sizeBytes", {
        id: "size",
        header: "File size",
        enableSorting: false,
        meta: {
          headClass: "w-[92px] text-right",
          cellClass:
            "text-right font-mono text-xs whitespace-nowrap text-ink-600",
        },
        cell: ({ getValue }) => formatFileSize(getValue()),
      }),
      columnHelper.accessor("uploadedAt", {
        id: SORT_COLUMN_ID,
        header: "Uploaded",
        meta: { headClass: "w-[132px]" },
        cell: ({ getValue }) => (
          <>
            <div className="text-ink-700">{formatDate(getValue())}</div>
            <div className="text-ink-500 text-xs">
              {formatTime(getValue())} WIB
            </div>
          </>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        enableSorting: false,
        meta: { headClass: "w-[128px]" },
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        meta: { headClass: "w-[208px]" },
        cell: ({ row }) => (
          <RowActions
            document={row.original}
            onView={() => onView(row.original)}
            onRetry={() => onRetry(row.original)}
            onChangeStatus={(status) => onChangeStatus(row.original, status)}
          />
        ),
      }),
    ],
    [onView, onRetry, onChangeStatus],
  );

  const sorting: SortingState = [
    { id: SORT_COLUMN_ID, desc: sort.dir === "desc" },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoization; the React Compiler is not enabled here
  const table = useReactTable({
    data: documents,
    columns,
    state: { sorting },
    manualSorting: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0] ?? sorting[0];
      onSortChange({ field: "uploadedAt", dir: first.desc ? "desc" : "asc" });
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id} className="border-line border-b bg-[#fafbfc]">
              {group.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  ColumnMetaX | undefined;
                const sortable = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const label = flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                );
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : undefined
                    }
                    className={`text-ink-600 px-4 py-2.5 text-left text-xs font-medium ${meta?.headClass ?? ""}`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="text-ink-900 inline-flex items-center gap-1"
                      >
                        {label}
                        {sorted === "asc" ? (
                          <ArrowUp className="size-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="size-3" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      label
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-line-soft hover:bg-subtle border-b last:border-0"
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as
                  ColumnMetaX | undefined;
                return (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 align-middle ${meta?.cellClass ?? ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
