import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../Charts/ui';

const chartData = [
  { stack: 'simple', naiveScore: 0, ragScore: 40, promptQLScore: 100 },
  // { stack: "cohere", ragScore: 15, promptQLScore: 98 },
];

const chartConfig = {
  naiveScore: {
    label: 'Naive RAG',
    color: '#9ebfdf',
  },
  ragScore: {
    label: 'Agentic RAG',
    color: '#7c9dbf',
  },
  promptQLScore: {
    label: 'PromptQL',
    color: '#B6FC34',
  },
} satisfies ChartConfig;

// Add the style block
const styles = `
  div[data-chart] {
    height: 450px !important;
    width: 100% !important;
  }
`;

export default function Chart() {
  return (
    <>
      <style>{styles}</style>
      <ChartContainer config={chartConfig} className="bg-white h-full w-full px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            accessibilityLayer
            data={chartData}
            barGap={8}
            barCategoryGap={40}
            margin={{
              top: 60,
              right: 20,
              bottom: 30,
              left: 20,
            }}
          >
            <text
              x="50%"
              y={30}
              textAnchor="middle"
              style={{
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Accuracy
            </text>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="stack"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 0)}
            />
            <YAxis width={35} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="naiveScore"
              fill="var(--color-naiveScore)"
              radius={4}
              maxBarSize={60}
              label={{ position: 'top', fontSize: 12 }}
            />
            <Bar
              dataKey="ragScore"
              fill="var(--color-ragScore)"
              radius={4}
              maxBarSize={60}
              label={{ position: 'top', fontSize: 12 }}
            />
            <Bar
              dataKey="promptQLScore"
              fill="var(--color-promptQLScore)"
              radius={4}
              maxBarSize={60}
              label={{ position: 'top', fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
