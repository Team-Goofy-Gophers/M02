import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DocumentsTab from "~/components/profile/documentsTab";
import DatasetsTab from "~/components/profile/datasetsTab";
import { api } from "~/trpc/server";

const Page = async () => {
  const user = await api.user.me();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab />
        </TabsContent>

        <TabsContent value="datasets" className="space-y-6">
          <DatasetsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
