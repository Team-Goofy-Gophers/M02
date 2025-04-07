import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Settings, User, BarChart, LogOut } from "lucide-react";
import { ProfileHeader } from "~/components/profile-header";
import { UsageChart } from "~/components/usage-chart";
import { DocumentsTable } from "~/components/documents-table";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ProfileHeader />

      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="/placeholder.svg?height=36&width=36"
                  alt="Avatar"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-muted-foreground text-xs">
                  john.doe@example.com
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Usage
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="datasets">Datasets</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">128</div>
                      <p className="text-muted-foreground text-xs">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Datasets Generated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">64</div>
                      <p className="text-muted-foreground text-xs">
                        +8% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Storage Used
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.2 GB</div>
                      <p className="text-muted-foreground text-xs">
                        of 5 GB (24%)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Usage Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Over Time</CardTitle>
                    <CardDescription>
                      Your document processing activity for the past 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UsageChart />
                  </CardContent>
                </Card>

                {/* Most Used Models */}
                <Card>
                  <CardHeader>
                    <CardTitle>Most Used Models & Prompts</CardTitle>
                    <CardDescription>
                      Your frequently used AI models and prompt patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">GPT-4o</div>
                          <div className="text-muted-foreground text-sm">
                            42%
                          </div>
                        </div>
                        <div className="bg-secondary h-2 w-full rounded-full">
                          <div className="bg-primary h-2 w-[42%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Claude 3 Opus
                          </div>
                          <div className="text-muted-foreground text-sm">
                            28%
                          </div>
                        </div>
                        <div className="bg-secondary h-2 w-full rounded-full">
                          <div className="bg-primary h-2 w-[28%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Gemini Pro</div>
                          <div className="text-muted-foreground text-sm">
                            18%
                          </div>
                        </div>
                        <div className="bg-secondary h-2 w-full rounded-full">
                          <div className="bg-primary h-2 w-[18%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
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
              </TabsContent>

              <TabsContent value="datasets" className="space-y-6">
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
                        <div className="font-medium">
                          Invoice Data (April 2023)
                        </div>
                        <Button variant="outline" size="sm">
                          View Dataset
                        </Button>
                      </div>
                      <div className="flex items-center justify-between border-b p-4">
                        <div className="font-medium">
                          Contract Analysis Q1 2023
                        </div>
                        <Button variant="outline" size="sm">
                          View Dataset
                        </Button>
                      </div>
                      <div className="flex items-center justify-between border-b p-4">
                        <div className="font-medium">
                          Customer Feedback Summary
                        </div>
                        <Button variant="outline" size="sm">
                          View Dataset
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="font-medium">
                          Financial Reports 2022-2023
                        </div>
                        <Button variant="outline" size="sm">
                          View Dataset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
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
                      <Label htmlFor="export-format">
                        Default Export Format
                      </Label>
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
                            Automatically remove sensitive information from
                            documents
                          </p>
                        </div>
                        <Switch id="privacy-toggle" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            htmlFor="notifications-toggle"
                            className="block"
                          >
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
