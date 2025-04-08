import React from "react";
import { DocumentsTable } from "~/components/documents-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const DocumentsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
        <CardDescription>
          Your recently uploaded and processed documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentsTable />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
