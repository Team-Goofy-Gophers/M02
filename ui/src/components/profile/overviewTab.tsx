import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { UsageChart } from "~/components/usage-chart";

const OverviewTab = () => {
  return (
    <>
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
            <p className="text-muted-foreground text-xs">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 GB</div>
            <p className="text-muted-foreground text-xs">of 5 GB (24%)</p>
          </CardContent>
        </Card>
      </div>

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
                <div className="text-muted-foreground text-sm">42%</div>
              </div>
              <div className="bg-secondary h-2 w-full rounded-full">
                <div className="bg-primary h-2 w-[42%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Claude 3 Opus</div>
                <div className="text-muted-foreground text-sm">28%</div>
              </div>
              <div className="bg-secondary h-2 w-full rounded-full">
                <div className="bg-primary h-2 w-[28%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Gemini Pro</div>
                <div className="text-muted-foreground text-sm">18%</div>
              </div>
              <div className="bg-secondary h-2 w-full rounded-full">
                <div className="bg-primary h-2 w-[18%] rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewTab;
