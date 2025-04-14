import React from 'react';

type Result = 'accurate' | 'partial' | 'inaccurate';

const getColorForResult = (result: Result): string => {
  switch (result) {
    case 'accurate':
      return 'heatmap-success';
    case 'partial':
      return 'heatmap-warn';
    case 'inaccurate':
      return 'heatmap-error';
    default: {
      const exhaustiveCheck: never = result;
      return 'bg-gray-200';
    }
  }
};

export const renderHeatmapGrid = (data: Result[], cols: number) => (
  <div
    style={{
      display: 'grid',
      gap: '1px',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    }}
  >
    {data.map((result, idx) => (
      <div key={idx} className={`heatmap ${getColorForResult(result)}`} />
    ))}
  </div>
);
