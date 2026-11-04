"use client";

import type { ReactElement, ReactNode } from "react";
import { CircleAlert, CircleCheck, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DocStatus } from "@/types/document";

const STATUS_ITEMS: { value: DocStatus; label: string; icon: ReactNode }[] = [
  {
    value: "ingested",
    label: "Ingested",
    icon: <CircleCheck className="text-success" aria-hidden="true" />,
  },
  {
    value: "pending",
    label: "Pending",
    icon: <Clock className="text-warning" aria-hidden="true" />,
  },
  {
    value: "failed",
    label: "Failed",
    icon: <CircleAlert className="text-danger" aria-hidden="true" />,
  },
];

interface ChangeStatusMenuProps {
  status: DocStatus;
  onChange: (status: DocStatus) => void;
  trigger: ReactElement;
  itemPrefix?: string;
  side?: "top" | "bottom";
  children?: ReactNode;
}

export function ChangeStatusMenu({
  status,
  onChange,
  trigger,
  itemPrefix = "",
  side = "bottom",
  children,
}: ChangeStatusMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" side={side} className="w-[210px]">
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={(value) => onChange(value as DocStatus)}
        >
          <DropdownMenuLabel>Change status</DropdownMenuLabel>
          {STATUS_ITEMS.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              {item.icon}
              {itemPrefix}
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
