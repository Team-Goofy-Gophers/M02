import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { StudioHeader } from "~/components/studio-header";
import { DocumentBlocks } from "~/components/document-blocks";
import { DatasetPanel } from "~/components/dataset-panel";
import { PromptInterface } from "~/components/prompt-interface";
import { VisualAnalyticsPanel } from "~/components/visual-analytics-panel";
import { CollectionsSidebar } from "~/components/collections-sidebar";

export default function StudioPage() {
  return (
    <div className="flex h-screen flex-col">
      <StudioHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Collections Sidebar */}
        <CollectionsSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Financial Documents</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Share
                </Button>
                <Button size="sm">Add Documents</Button>
              </div>
            </div>

            <Tabs defaultValue="documents" className="h-[calc(100%-40px)]">
              <TabsList>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="dataset">Dataset</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="h-full overflow-auto">
                <DocumentBlocks />
              </TabsContent>

              <TabsContent value="dataset" className="h-full overflow-auto">
                <DatasetPanel />
              </TabsContent>

              <TabsContent value="analytics" className="h-full overflow-auto">
                <VisualAnalyticsPanel />
              </TabsContent>
            </Tabs>
          </div>

          {/* Prompt Interface (Bottom Bar) */}
          <PromptInterface />
        </div>
      </div>
    </div>
  );
}
