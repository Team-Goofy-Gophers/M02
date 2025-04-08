import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import OverviewTab from "~/components/profile/overviewTab";
import DocumentsTab from "~/components/profile/documentsTab";
import DatasetsTab from "~/components/profile/datasetsTab";
import SettingsTab from "~/components/profile/settingsTab";
import { api } from "~/trpc/server";

const Profile = async () => {
  const user = await api.user.me();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab />
        </TabsContent>

        <TabsContent value="datasets" className="space-y-6">
          <DatasetsTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
