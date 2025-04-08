"use client";

import React from "react";
import Loader from "~/components/loader";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import PromptInterface from "~/components/studio/promptInterface";
import DocumentsTab from "~/components/studio/documentsTab";
import DatasetTab from "~/components/studio/datasetTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import AddDocument from "~/components/studio/addDocument";

const Playground = ({ collectionId }: { collectionId: string }) => {
  const {
    data: collection,
    isLoading,
    error,
  } = api.collection.getCollection.useQuery({
    id: collectionId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !collection) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl font-bold">Error loading collection</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Add Documents</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Document Upload</DialogTitle>
                </DialogHeader>
                <AddDocument collectionId={collection.id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="dataset">Dataset</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="h-full overflow-auto">
            <DocumentsTab collection={collection} />
          </TabsContent>

          <TabsContent value="dataset" className="h-full overflow-auto">
            <DatasetTab collection={collection} />
          </TabsContent>
        </Tabs>
      </div>

      <PromptInterface />
    </div>
  );
};

export default Playground;
