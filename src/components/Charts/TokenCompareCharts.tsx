import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui';

const chartData = [
  { month: '5 tickets', mcpScore: 5012, promptQLScore: 2011, promptQLTokens: 9699 },
  { month: '10 tickets', mcpScore: 23788, promptQLScore: 2011, promptQLTokens: 13169 },
  { month: '20 tickets', mcpScore: 82519, promptQLScore: 2011, promptQLTokens: 19499 },
];

const chartConfig = {
  mcpScore: {
    label: 'Tool calling (Claude + MCP)',
    color: '#6B8CAE',
  },
  promptQLScore: {
    label: 'PromptQL Context Size',
    color: '#B6FC34',
  },
  promptQLTokens: {
    label: 'PromptQL Tokens (tokens)',
    color: '#1B5E20',
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
      <LineChart
        accessibilityLayer
        data={chartData}
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
          Context size comparison
        </text>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          padding={{ left: 50, right: 50 }} // Added padding to shift the data points away from axes

          // Removed tickFormatter to show full text
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="mcpScore"
          stroke={chartConfig.mcpScore.color}
          strokeWidth={3}
          label={{
            position: 'top',
            fill: chartConfig.mcpScore.color,
            fontSize: 12,
            dy: -10, // Moved labels up slightly
          }}
        />
        <Line
          dataKey="promptQLScore"
          stroke={chartConfig.promptQLScore.color}
          strokeWidth={3}
          label={{
            position: 'top',
            fill: '#1B5E20',
            fontSize: 12,
            dy: -10, // Moved labels up slightly
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
