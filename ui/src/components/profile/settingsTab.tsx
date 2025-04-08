import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";

const SettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select defaultValue="en" disabled>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="export-format">Default Export Format</Label>
          <Select defaultValue="csv">
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="privacy-toggle" className="block">
                Privacy & De-identification
              </Label>
              <p className="text-muted-foreground text-sm">
                Automatically remove sensitive information from documents
              </p>
            </div>
            <Switch id="privacy-toggle" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-toggle" className="block">
                Email Notifications
              </Label>
              <p className="text-muted-foreground text-sm">
                Receive notifications when processing is complete
              </p>
            </div>
            <Switch id="notifications-toggle" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
