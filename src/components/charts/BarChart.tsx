
import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface BarChartProps {
  title: string;
  data: DataPoint[];
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  description?: string;
  stacked?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  dataKeys,
  xAxisKey = "name",
  yAxisFormatter = (value) => `${value}`,
  tooltipFormatter = (value) => `${value}`,
  description,
  stacked = false,
}) => {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            {dataKeys.map((dataKey, index) => (
              <Bar
                key={index}
                dataKey={dataKey.key}
                name={dataKey.name}
                fill={dataKey.color}
                stackId={stacked ? "a" : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
