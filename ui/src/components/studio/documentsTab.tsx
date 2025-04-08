"use client";

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
  File,
  FileText,
  FileSpreadsheet,
  FileJson,
  FileImage,
  FileLock,
  FileMinus,
} from "lucide-react";
import type { DocumentType } from "@prisma/client";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import AddDocument from "~/components/studio/addDocument";

// TODO(Omkar): Remove hardcode
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

const DocumentsTab = ({
  collection,
}: {
  collection: NonNullable<
    inferProcedureOutput<AppRouter["collection"]["getCollection"]>
  >;
}) => {
  const getFileIcon = (type: DocumentType) => {
    switch (type) {
      case "PDF":
        return <FileLock className="h-4 w-4 text-red-500" />;
      case "TXT":
        return <FileText className="h-4 w-4 text-pink-500" />;
      case "DOCX":
        return <FileMinus className="h-4 w-4 text-blue-500" />;
      case "CSV":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case "JSON":
        return <FileJson className="h-4 w-4 text-yellow-500" />;
      case "IMAGE":
        return <FileImage className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {collection.Clusters.map((cluster, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{cluster.title}</CardTitle>
                <CardDescription className="mt-1">
                  {cluster.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="gap flex h-full flex-col gap-8">
            <div className="max-h-80 grow space-y-1 overflow-scroll">
              {cluster.Documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(document.type)}
                    <span className="text-sm">{document.name}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {document.size}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Summary</div>
              <p className="text-muted-foreground text-sm">{cluster.summary}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Confidence</div>
              <div className="flex items-center gap-2">
                <Progress value={cluster.confidence} className="h-2 w-24" />
                <span className="text-xs font-medium">
                  {cluster.confidence}%
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 mt-auto border-t px-6 py-3">
            <div className="flex w-full items-center justify-between">
              {cluster.agentsUsed.map((agent, i) => (
                <Badge key={i} variant="outline" className="bg-card">
                  {agent}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}

      <Card className="flex h-full min-h-[300px] flex-col items-center justify-center border-dashed">
        <AddDocument
          collectionId={collection.id}
          className="size-full h-4/5 w-4/5"
        />
      </Card>
    </div>
  );
};

export default DocumentsTab;
