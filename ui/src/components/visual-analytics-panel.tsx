"use client";

import { useState } from "react";
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
import {
  Download,
  RefreshCw,
  BarChartIcon,
  PieChartIcon,
  LineChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "~/components/ui/chart";

// Sample data for charts
const barChartData = [
  { name: "Acme Corp", amount: 5250 },
  { name: "Globex Inc", amount: 7800 },
  { name: "Stark Industries", amount: 4200 },
  { name: "Wayne Enterprises", amount: 7600 },
];

const pieChartData = [
  { name: "Paid", value: 9450 },
  { name: "Pending", value: 7800 },
  { name: "Overdue", value: 7600 },
];

const lineChartData = [
  { date: "Mar 5", amount: 5250 },
  { date: "Mar 12", amount: 7800 },
  { date: "Mar 18", amount: 4200 },
  { date: "Mar 25", amount: 7600 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function VisualAnalyticsPanel() {
  const [activeChart, setActiveChart] = useState("bar");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoice Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bar" onValueChange={setActiveChart}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="bar" className="gap-2">
              <BarChartIcon className="h-4 w-4" />
              Bar
            </TabsTrigger>
            <TabsTrigger value="pie" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Pie
            </TabsTrigger>
            <TabsTrigger value="line" className="gap-2">
              <LineChartIcon className="h-4 w-4" />
              Line
            </TabsTrigger>
          </TabsList>

          <Select defaultValue="amount">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount">Invoice Amount</SelectItem>
              <SelectItem value="count">Invoice Count</SelectItem>
              <SelectItem value="status">Payment Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeChart === "bar" && "Invoice Amounts by Customer"}
                {activeChart === "pie" && "Invoice Amounts by Payment Status"}
                {activeChart === "line" && "Invoice Amounts Over Time"}
              </CardTitle>
              <CardDescription>
                {activeChart === "bar" &&
                  "Comparison of total invoice amounts across customers"}
                {activeChart === "pie" &&
                  "Distribution of invoice amounts by payment status"}
                {activeChart === "line" && "Trend of invoice amounts over time"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <TabsContent value="bar" className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        fill="#8884d8"
                        name="Invoice Amount ($)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="pie" className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="line" className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Invoice Amount ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </div>

              <div className="text-muted-foreground mt-4 text-sm">
                <p className="font-medium">AI-Generated Insight:</p>
                {activeChart === "bar" && (
                  <p>
                    Globex Inc and Wayne Enterprises are your highest-value
                    customers, accounting for 61% of total invoice value.
                  </p>
                )}
                {activeChart === "pie" && (
                  <p>
                    38% of your invoice value is currently paid, while 31% is
                    pending and 31% is overdue.
                  </p>
                )}
                {activeChart === "line" && (
                  <p>
                    Invoice amounts peaked on March 12th and have been
                    fluctuating throughout the month.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>
              Summary of important invoice metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Total Invoice Value</div>
                  <div className="text-2xl font-bold">$24,850</div>
                </div>
                <div className="text-sm text-green-600">
                  +12% from last month
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    Average Invoice Amount
                  </div>
                  <div className="text-2xl font-bold">$6,212.50</div>
                </div>
                <div className="text-sm text-green-600">
                  +5% from last month
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Payment Rate</div>
                  <div className="text-2xl font-bold">50%</div>
                </div>
                <div className="text-sm text-red-600">-10% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>AI-generated insights and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="font-medium">Follow up on overdue payments</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wayne Enterprises invoice is overdue by 15 days. Consider
                  sending a reminder.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Generate Email
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="font-medium">Review payment terms</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Consider offering early payment discounts to improve cash
                  flow.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Analysis
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="font-medium">Customer spending patterns</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Globex Inc has increased spending by 15% compared to previous
                  quarter.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Trends
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
