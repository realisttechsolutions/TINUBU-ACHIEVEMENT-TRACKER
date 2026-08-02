
import React from "react";
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface AreaChartProps {
  title: string;
  data: DataPoint[];
  dataKey: string;
  color?: string;
  xAxisKey?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  description?: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  title,
  data,
  dataKey,
  color = "#7E69AB",
  xAxisKey = "name",
  yAxisFormatter = (value) => `${value}`,
  tooltipFormatter = (value) => `${value}`,
  description,
}) => {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsAreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tickFormatter={yAxisFormatter} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              formatter={tooltipFormatter}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill={`url(#color-${dataKey})`}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChart;
