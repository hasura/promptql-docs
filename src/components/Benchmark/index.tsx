import React from 'react';
import { renderHeatmapGrid, getColorForResult } from '../Spec/Results';

type Result = 'accurate' | 'partial' | 'inaccurate';

const Results = () => {
  // Sample data for the main heatmap
  const heatmapData = {
    xLabels: [1, 2, 3, 4, 5],
    yLabels: [1, 2, 3, 4, 5],
    data: [
      ['accurate', 'partial', 'accurate', 'inaccurate', 'partial'],
      ['partial', 'accurate', 'accurate', 'partial', 'accurate'],
      ['accurate', 'accurate', 'partial', 'accurate', 'accurate'],
      ['inaccurate', 'partial', 'accurate', 'accurate', 'partial'],
      ['partial', 'accurate', 'accurate', 'partial', 'accurate'],
    ],
  };

  // Sample data for the comparison table
  const comparisonData = [
    {
      prompt: 'Prioritization task prompt  -- over last 5 open tickets',
      promptql: [
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
      ],
      claude: [
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'partial',
        'inaccurate',
        'partial',
        'inaccurate',
        'partial',
        'partial',
        'partial',
        'inaccurate',
        'partial',
        'accurate',
        'accurate',
        'partial',
        'partial',
        'partial',
        'accurate',
        'accurate',
        'partial',
        'partial',
        'partial',
      ],
    },
    {
      prompt: 'Prioritization task prompt  -- over last 10 open tickets',
      promptql: [
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
      ],
      claude: [
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'inaccurate',
        'partial',
        'partial',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
      ],
    },
    {
      prompt: 'Prioritization task prompt  -- over last 20 open tickets',
      promptql: [
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
      ],
      claude: [
        'partial',
        'partial',
        'partial',
        'inaccurate',
        'partial',
        'inaccurate',
        'partial',
        'inaccurate',
        'partial',
        'partial',
        'partial',
        'partial',
        'inaccurate',
        'partial',
        'inaccurate',
        'partial',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'partial',
        'partial',
        'inaccurate',
      ],
    },
  ];

  const analysisComparisonData = [
    {
      prompt: 'Analysis task prompt -- over the last 10 tickets',
      promptql: [
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'accurate',
        'accurate',
        'partial',
        'accurate',
      ],
      claude: [
        'partial',
        'accurate',
        'inaccurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'inaccurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'inaccurate',
        'accurate',
        'inaccurate',
        'inaccurate',
        'partial',
        'partial',
        'partial',
        'partial',
        'inaccurate',
        'accurate',
        'inaccurate',
        'accurate',
        'inaccurate',
      ],
    },
    {
      prompt:
        'Analysis task prompt -- over the last 20 tickets, filtered where slowest response was greater than response SLA of 2 hours',
      promptql: [
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'partial',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'partial',
        'accurate',
        'accurate',
        'partial',
        'accurate',
        'partial',
      ],
      claude: [
        'inaccurate',
        'partial',
        'partial',
        'accurate',
        'accurate',
        'inaccurate',
        'accurate',
        'partial',
        'accurate',
        'accurate',
        'inaccurate',
        'accurate',
        'partial',
        'accurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'accurate',
        'accurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'partial',
        'partial',
        'inaccurate',
        'inaccurate',
        'accurate',
        'partial',
        'accurate',
        'inaccurate',
        'inaccurate',
        'accurate',
        'inaccurate',
        'partial',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'accurate',
        'inaccurate',
        'inaccurate',
        'inaccurate',
        'partial',
        'accurate',
        'accurate',
        'inaccurate',
        'partial',
        'partial',
        'accurate',
        'accurate',
        'inaccurate',
        'inaccurate',
        'partial',
        'partial',
        'accurate',
        'inaccurate',
        'inaccurate',
        'partial',
        'accurate',
        'inaccurate',
      ],
    },
  ];

  // Helper function to get color for result
  const getColorForResult = result => {
    switch (result) {
      case 'accurate':
        return 'heatmap-success';
      case 'partial':
        return 'heatmap-warn';
      case 'inaccurate':
        return 'heatmap-error';
      default:
        return '';
    }
  };

  // Helper function to render heatmap grid
  const renderHeatmapGrid = (data, columns) => {
    const rows = Math.ceil(data.length / columns);
    return (
      <div className="heatmap-grid">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="heatmap-row">
            {Array.from({ length: columns }).map((_, colIndex) => {
              const index = rowIndex * columns + colIndex;
              if (index < data.length) {
                return <div key={colIndex} className={`heatmap-cell ${getColorForResult(data[index])}`}></div>;
              }
              return <div key={colIndex} className="heatmap-cell-empty"></div>;
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="results-container">
      {/* Main Heatmap */}
      <p className="description">
        We run each prompt 5 times, and record the accuracy of the result. Each result is a list of data points. In the
        heat maps that you see below, columns represent a particular "run" and the rows represent the data points in the
        output.
      </p>
      {/* Primary Prompt Section */}
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">3.1 Prioritization task prompt</h2>
        </div>
        <div className="section-content">
          <div className="prompt-container">
            <div className="prompt-text">
              <p>
                Give me a sorted list of top 5 support tickets which I should prioritize amongst last 30 most recent
                open tickets.
              </p>

              <p>For each ticket, attach the following information to each ticket:</p>

              <ol className="numbered-list">
                <li>the project_id</li>
                <li>the plan of the project</li>
                <li>the criticality of the issue</li>
                <li>the monthly average revenue for the project</li>
                <li>list of recent ticket_ids for that project from the last 6 months</li>
              </ol>

              <p>Extract the project_id from the ticket description.</p>

              <p>
                Determine the criticality of the issue of a ticket, by looking at the ticket and its comments. These are
                categories of issue criticality in descending order of importance:
              </p>
              <ol className="numbered-list">
                <li>Production downtime</li>
                <li>Instability in production</li>
                <li>Performance degradation in production</li>
                <li>Bug</li>
                <li>Feature request</li>
                <li>How-to</li>
              </ol>

              <p>
                Now, prioritize the tickets according to the following rules. Assign the highest priority to production
                issues. Within this group, prioritize advanced plan &gt; base plan &gt; free plan. Next, take
                non-production issues, and within this group, order by monthly average revenue.
              </p>

              <p>In case there are ties within the 2 groups above, break the tie using:</p>

              <ol className="numbered-list">
                <li>Time since when the ticket was open</li>
                <li>Recent negative support or product experience in the last 6 months</li>
              </ol>

              <p>Plan names are "advanced", "base" and "free".</p>
            </div>
          </div>
        </div>

        <div className="table-container desktop-only">
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="table-header">Prompt Version</th>
                  <th className="table-header">PromptQL Results</th>
                  <th className="table-header">Claude + MCP Results</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="table-cell prompt-cell">{row.prompt}</td>
                    <td className="table-cell">{renderHeatmapGrid(row.promptql, 5)}</td>
                    <td className="table-cell">{renderHeatmapGrid(row.claude, 5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container mobile-only">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="table-header">Prompt Version</th>
                <th className="table-header">PromptQL Results</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="table-row">
                  <td className="table-cell prompt-cell">{row.prompt}</td>
                  <td className="table-cell">{renderHeatmapGrid(row.promptql, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container mobile-only">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="table-header">Claude Version</th>
                <th className="table-header">Claude + MCP Results</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="table-row">
                  <td className="table-cell prompt-cell">{row.prompt}</td>
                  <td className="table-cell">{renderHeatmapGrid(row.claude, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis task */}
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">3.2 Analysis task prompt</h2>
        </div>
        <div className="section-content">
          <div className="prompt-container">
            <div className="prompt-text">
              <p>
                In the last 10 tickets, look at the comments and find the slowest response made by the support agent.
              </p>
              <p>
                Classify these as whether the reason for the delay was because of a delay by the customer or by the
                agent.
              </p>

              <p>
                Return the list of tickets sorted by ticket id, along with the comment id of the slowest comment and the
                classification result.
              </p>
            </div>
          </div>
        </div>

        <div className="table-container desktop-only">
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="table-header">Prompt Version</th>
                  <th className="table-header">PromptQL Results</th>
                  <th className="table-header">Claude + MCP Results</th>
                </tr>
              </thead>
              <tbody>
                {analysisComparisonData.map((row, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="table-cell prompt-cell">{row.prompt}</td>
                    <td className="table-cell">{renderHeatmapGrid(row.promptql, 5)}</td>
                    <td className="table-cell">{renderHeatmapGrid(row.claude, 5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container mobile-only">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="table-header">Prompt Version</th>
                <th className="table-header">PromptQL Results</th>
              </tr>
            </thead>
            <tbody>
              {analysisComparisonData.map((row, idx) => (
                <tr key={idx} className="table-row">
                  <td className="table-cell prompt-cell">{row.prompt}</td>
                  <td className="table-cell">{renderHeatmapGrid(row.promptql, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container mobile-only">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="table-header">Claude Version</th>
                <th className="table-header">Claude + MCP Results</th>
              </tr>
            </thead>
            <tbody>
              {analysisComparisonData.map((row, idx) => (
                <tr key={idx} className="table-row">
                  <td className="table-cell prompt-cell">{row.prompt}</td>
                  <td className="table-cell">{renderHeatmapGrid(row.claude, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
