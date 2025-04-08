import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const DatasetsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Datasets</CardTitle>
        <CardDescription>
          Datasets extracted from your documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="flex items-center justify-between border-b p-4">
            <div className="font-medium">Invoice Data (April 2023)</div>
            <Button variant="outline" size="sm">
              View Dataset
            </Button>
          </div>
          <div className="flex items-center justify-between border-b p-4">
            <div className="font-medium">Contract Analysis Q1 2023</div>
            <Button variant="outline" size="sm">
              View Dataset
            </Button>
          </div>
          <div className="flex items-center justify-between border-b p-4">
            <div className="font-medium">Customer Feedback Summary</div>
            <Button variant="outline" size="sm">
              View Dataset
            </Button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="font-medium">Financial Reports 2022-2023</div>
            <Button variant="outline" size="sm">
              View Dataset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetsTab;
