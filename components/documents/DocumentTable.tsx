import { ArrowDown } from "lucide-react";
import { DocumentRow } from "@/components/documents/DocumentRow";
import type { TenderDocument } from "@/types/document";

interface DocumentTableProps {
  documents: TenderDocument[];
}

const TH = "px-4 py-2.5 text-left text-xs font-medium text-ink-600";

export function DocumentTable({ documents }: DocumentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-line border-b bg-[#fafbfc]">
            <th scope="col" className={TH}>
              Document name
            </th>
            <th scope="col" className={`${TH} w-[148px]`}>
              Category
            </th>
            <th scope="col" className={`${TH} w-[92px] text-right`}>
              File size
            </th>
            <th
              scope="col"
              aria-sort="descending"
              className={`${TH} w-[132px]`}
            >
              <span className="text-ink-900 inline-flex items-center gap-1">
                Uploaded
                <ArrowDown className="size-3" aria-hidden="true" />
              </span>
            </th>
            <th scope="col" className={`${TH} w-[128px]`}>
              Status
            </th>
            <th scope="col" className={`${TH} w-[208px]`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
