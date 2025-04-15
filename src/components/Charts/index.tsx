import React from 'react';
import ScoreCompareCharts from './ScoreCompareCharts';
import TokenCompareCharts from './TokenCompareCharts';

export default function Charts() {
  return (
    <div style={{ marginBottom: '2rem', paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <ScoreCompareCharts />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <TokenCompareCharts />
      </div>
    </div>
  );
}
