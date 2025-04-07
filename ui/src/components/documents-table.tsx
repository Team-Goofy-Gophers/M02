"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  FileText,
  FileSpreadsheet,
  FileJson,
  Image,
  MoreHorizontal,
  Eye,
  Download,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const documents = [
  {
    id: 1,
    name: "Q1 Financial Report.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2023-04-28",
    status: "Processed",
  },
  {
    id: 2,
    name: "Customer Feedback.docx",
    type: "DOCX",
    size: "1.8 MB",
    uploadedAt: "2023-04-25",
    status: "Processed",
  },
  {
    id: 3,
    name: "Sales Data 2023.csv",
    type: "CSV",
    size: "4.2 MB",
    uploadedAt: "2023-04-20",
    status: "Processed",
  },
  {
    id: 4,
    name: "Product Catalog.json",
    type: "JSON",
    size: "3.1 MB",
    uploadedAt: "2023-04-15",
    status: "Processing",
  },
  {
    id: 5,
    name: "Receipt Scan.jpg",
    type: "Image",
    size: "1.2 MB",
    uploadedAt: "2023-04-10",
    status: "Processed",
  },
];

export function DocumentsTable() {
  const [docs, setDocs] = useState(documents);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "DOCX":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "CSV":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case "JSON":
        return <FileJson className="h-4 w-4 text-yellow-500" />;
      case "Image":
        return <Image className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Processed
          </Badge>
        );
      case "Processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="bg-muted/50 grid grid-cols-[1fr_100px_100px_150px_100px_40px] gap-4 border-b p-4 font-medium">
        <div>Name</div>
        <div>Type</div>
        <div>Size</div>
        <div>Uploaded</div>
        <div>Status</div>
        <div></div>
      </div>
      {docs.map((doc) => (
        <div
          key={doc.id}
          className="grid grid-cols-[1fr_100px_100px_150px_100px_40px] gap-4 border-b p-4 last:border-0"
        >
          <div className="flex items-center gap-2">
            {getFileIcon(doc.type)}
            <span className="font-medium">{doc.name}</span>
          </div>
          <div className="text-muted-foreground">{doc.type}</div>
          <div className="text-muted-foreground">{doc.size}</div>
          <div className="text-muted-foreground">{doc.uploadedAt}</div>
          <div>{getStatusBadge(doc.status)}</div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
