"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Download, Filter, Plus, Trash, Edit, Eye, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// Sample data for the dataset
const initialData = [
  {
    id: 1,
    invoiceNumber: "INV-2023-0342",
    date: "2023-03-05",
    customer: "Acme Corp",
    amount: 5250.0,
    status: "Paid",
    confidence: 98,
  },
  {
    id: 2,
    invoiceNumber: "INV-2023-0343",
    date: "2023-03-12",
    customer: "Globex Inc",
    amount: 7800.0,
    status: "Pending",
    confidence: 96,
  },
  {
    id: 3,
    invoiceNumber: "INV-2023-0344",
    date: "2023-03-18",
    customer: "Stark Industries",
    amount: 4200.0,
    status: "Paid",
    confidence: 99,
  },
  {
    id: 4,
    invoiceNumber: "INV-2023-0345",
    date: "2023-03-25",
    customer: "Wayne Enterprises",
    amount: 7600.0,
    status: "Overdue",
    confidence: 97,
  },
];

// Column definitions
const columns = [
  { id: "invoiceNumber", name: "Invoice Number", type: "string" },
  { id: "date", name: "Date", type: "date" },
  { id: "customer", name: "Customer", type: "string" },
  { id: "amount", name: "Amount", type: "number" },
  { id: "status", name: "Status", type: "string" },
];

export function DatasetPanel() {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState<{
    rowId: number | null;
    colId: string | null;
  }>({
    rowId: null,
    colId: null,
  });
  const [editValue, setEditValue] = useState("");

  const handleDoubleClick = (
    rowId: number,
    colId: string,
    value: string | number,
  ) => {
    setEditingCell({ rowId, colId });
    setEditValue(value.toString());
  };

  const handleSaveEdit = () => {
    if (editingCell.rowId !== null && editingCell.colId !== null) {
      setData(
        data.map((row) =>
          row.id === editingCell.rowId
            ? {
                ...row,
                ...(editingCell.colId
                  ? { [editingCell.colId]: editValue }
                  : {}),
              }
            : row,
        ),
      );
      setEditingCell({ rowId: null, colId: null });
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          High
        </Badge>
      );
    } else if (confidence >= 85) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          Medium
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Low
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Invoice Dataset</h2>
          <p className="text-muted-foreground text-sm">
            Extracted from 4 invoice documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Schema
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        {/* Table Header */}
        <div className="bg-muted/50 grid grid-cols-[40px_repeat(5,1fr)_80px] border-b p-2">
          <div className="px-2">#</div>
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex items-center gap-1 px-2 font-medium"
            >
              {column.name}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Type: {column.type}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <div className="px-2 text-center">Confidence</div>
        </div>

        {/* Table Body */}
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[40px_repeat(5,1fr)_80px] border-b p-2 last:border-0"
          >
            <div className="text-muted-foreground flex items-center px-2 text-sm">
              {row.id}
            </div>

            {columns.map((column) => {
              const cell = row[column.id as keyof typeof row];
              return (
                <div
                  key={column.id}
                  className="px-2"
                  onDoubleClick={() =>
                    handleDoubleClick(
                      row.id,
                      column.id,
                      row[column.id as keyof typeof row],
                    )
                  }
                >
                  {editingCell.rowId === row.id &&
                  editingCell.colId === column.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                      autoFocus
                      className="h-8"
                    />
                  ) : (
                    <div className="flex h-8 items-center">
                      {column.id === "amount"
                        ? `$${typeof cell === "string" ? cell : cell.toFixed(2)}`
                        : row[column.id as keyof typeof row]}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-center px-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {getConfidenceBadge(row.confidence)}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Confidence: {row.confidence}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}

        {/* Add Row Button */}
        <div className="flex items-center justify-center p-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Row
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing 4 of 4 records
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View Source
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Trash className="h-4 w-4" />
            Clear Data
          </Button>
        </div>
      </div>
    </div>
  );
}
