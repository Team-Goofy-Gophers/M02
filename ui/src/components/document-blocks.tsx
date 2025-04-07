"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import {
  FileText,
  FileSpreadsheet,
  FileJson,
  Image,
  MoreHorizontal,
  Eye,
  Download,
  Trash,
  BarChart,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const documentBlocks = [
  {
    id: 1,
    title: "Q1 Financial Reports",
    description: "Quarterly financial statements and reports",
    files: [
      { name: "Q1_Income_Statement.pdf", type: "PDF", size: "1.2 MB" },
      { name: "Q1_Balance_Sheet.pdf", type: "PDF", size: "0.8 MB" },
      { name: "Q1_Cash_Flow.pdf", type: "PDF", size: "0.9 MB" },
    ],
    summary: "Financial reports for Q1 2023 showing revenue growth of 12% YoY",
    confidence: 92,
    model: "GPT-4o",
    analysisType: "Financial Document Analysis",
  },
  {
    id: 2,
    title: "Customer Invoices (March 2023)",
    description: "Monthly customer invoices",
    files: [
      { name: "INV-2023-0342.pdf", type: "PDF", size: "0.5 MB" },
      { name: "INV-2023-0343.pdf", type: "PDF", size: "0.6 MB" },
      { name: "INV-2023-0344.pdf", type: "PDF", size: "0.4 MB" },
      { name: "INV-2023-0345.pdf", type: "PDF", size: "0.7 MB" },
    ],
    summary: "4 invoices totaling $24,850 with payment terms of Net 30",
    confidence: 96,
    model: "Claude 3 Opus",
    analysisType: "Invoice Processing",
  },
  {
    id: 3,
    title: "Vendor Contracts",
    description: "Active vendor agreements and contracts",
    files: [
      { name: "SupplierA_Contract.docx", type: "DOCX", size: "1.8 MB" },
      { name: "SupplierB_Contract.pdf", type: "PDF", size: "2.2 MB" },
      { name: "SupplierC_Contract.pdf", type: "PDF", size: "1.9 MB" },
    ],
    summary:
      "3 vendor contracts with renewal dates in Q3 2023, average term length of 24 months",
    confidence: 88,
    model: "GPT-4o",
    analysisType: "Contract Analysis",
  },
];

export function DocumentBlocks() {
  const [blocks, setBlocks] = useState(documentBlocks);

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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block) => (
        <Card key={block.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{block.title}</CardTitle>
                <CardDescription className="mt-1">
                  {block.description}
                </CardDescription>
              </div>
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
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart className="mr-2 h-4 w-4" />
                    Analyze
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-1">
              {block.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Summary</div>
              <p className="text-muted-foreground text-sm">{block.summary}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">Confidence</div>
              <div className="flex items-center gap-2">
                <Progress value={block.confidence} className="h-2 w-24" />
                <span className="text-xs font-medium">{block.confidence}%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t px-6 py-3">
            <div className="flex w-full items-center justify-between">
              <Badge variant="outline" className="bg-card">
                {block.model}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {block.analysisType}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Add New Block Card */}
      <Card className="flex h-full min-h-[300px] flex-col items-center justify-center border-dashed">
        <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
          <div className="rounded-full border-2 border-dashed p-4">
            <Plus className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium">Add New Documents</h3>
          <p className="text-muted-foreground text-sm">
            Upload files or create a new document collection
          </p>
          <Button className="mt-2">Upload Files</Button>
        </div>
      </Card>
    </div>
  );
}
