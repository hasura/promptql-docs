import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui';

const chartData = [
  { month: '', mcpScore: 58, promptQLScore: 96 },
  // { month: "0.18", mcpScore: 9, promptQLScore: 0 },
  // { month: "0.31", mcpScore: 6, promptQLScore: 0 },
  // { month: "0.44", mcpScore: 3, promptQLScore: 0 },
  // { month: "0.56", mcpScore: 3, promptQLScore: 0 },
  // { month: "0.69", mcpScore: 2, promptQLScore: 2 },
  // { month: "0.82", mcpScore: 0, promptQLScore: 10 },
  // { month: "0.95", mcpScore: 0, promptQLScore: 15 },
];

const chartConfig = {
  mcpScore: {
    label: 'Tool calling (Claude + MCP)',
    color: '#6B8CAE',
  },
  promptQLScore: {
    label: 'PromptQL',
    color: '#B6FC34',
  },
} satisfies ChartConfig;

export default function ScoreCompareCharts() {
  return (
    <ChartContainer
      config={chartConfig}
      style={{
        padding: '1.5rem',
        minHeight: '400px',
        height: '100%',
        width: '100%',
      }}
    >
      <BarChart accessibilityLayer data={chartData} margin={{ top: 50, right: 30, bottom: 20, left: 40 }}>
        <text
          x="50%"
          y={20}
          textAnchor="middle"
          fill="var(--body-text-color)"
          style={{
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          Avg. accuracy
        </text>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value.slice(0, 4)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="mcpScore" fill="var(--color-mcpScore)" radius={4} maxBarSize={50} />
        <Bar dataKey="promptQLScore" fill="var(--color-promptQLScore)" radius={4} maxBarSize={50} />
      </BarChart>
    </ChartContainer>
  );
}
