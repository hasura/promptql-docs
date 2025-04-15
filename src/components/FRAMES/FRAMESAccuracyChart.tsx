import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

export default function Chart() {
  return (
    <ChartContainer config={chartConfig} className="bg-white min-h-[400px] h-full w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        barGap={0}
        barCategoryGap={70}
        margin={{ top: 50, right: 30, bottom: 20, left: 40 }} // Increased top margin to accommodate title
      >
        <text
          x="50%"
          y={20}
          textAnchor="middle"
          style={{
            fontSize: '16px',
            fill: '#ffffff',
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
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="naiveScore"
          fill="var(--color-naiveScore)"
          radius={4}
          maxBarSize={50}
          label={{ position: 'top', fill: '#ffffff' }}
        />
        <Bar
          dataKey="ragScore"
          fill="var(--color-ragScore)"
          radius={4}
          maxBarSize={50}
          label={{ position: 'top', fill: '#ffffff' }}
        />
        <Bar
          dataKey="promptQLScore"
          fill="var(--color-promptQLScore)"
          radius={4}
          maxBarSize={50}
          label={{ position: 'top', fill: '#ffffff' }}
        />
      </BarChart>
    </ChartContainer>
  );
}
