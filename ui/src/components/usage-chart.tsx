"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "~/components/ui/chart";

const data = [
  { name: "Apr 1", documents: 4, datasets: 2 },
  { name: "Apr 5", documents: 7, datasets: 3 },
  { name: "Apr 10", documents: 12, datasets: 5 },
  { name: "Apr 15", documents: 18, datasets: 8 },
  { name: "Apr 20", documents: 24, datasets: 12 },
  { name: "Apr 25", documents: 30, datasets: 15 },
  { name: "Apr 30", documents: 36, datasets: 18 },
];

export function UsageChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="documents"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="datasets" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
