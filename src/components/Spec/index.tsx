import React from 'react';
import { renderHeatmapGrid } from './Results';

type Result = 'accurate' | 'partial' | 'inaccurate';

const comparisonData: {
  prompt: string;
  promptql: Result[];
  claude: Result[];
  comment: string;
}[] = [
  {
    prompt: `
      <b>Task:</b> Help the user get the top 5 priority tickets, taking into account the criticality of the ticket, the associated project plan tier, the project revenue and so on. <br/><br/>
      <b>Legend:</b> Colors represent accuracy. Columns represent 5 runs of the same prompt.
      `,
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
    comment: `<b>Task over 5 tickets:</b><br/>
  Highest priority ticket is correct.`,
  },
  {
    prompt: '',
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
    comment: `<b>Task over 10 tickets:</b><br/>
       None of the high priority tickets are in the right order.
       `,
  },
  {
    prompt: '',
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
    comment: `<b>Task over 20 tickets:</b><br/>
       ~50% of the high priority tickets are missing.
       `,
  },
];

export function Grid() {
  return (
    <div className="hidden pt-8 md:block">
      <div
        style={{
          overflowX: 'auto',
          maxWidth: '800px',
          borderRadius: '0.5rem',
        }}
      >
        <table
          style={{
            tableLayout: 'fixed',
            width: '100%',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: '50%',
                  textAlign: 'left',
                  padding: '1rem',
                }}
              >
                Evaluation
              </th>
              <th
                style={{
                  width: '10%',
                  textAlign: 'left',
                  padding: '1rem',
                }}
              >
                PromptQL
              </th>
              <th
                style={{
                  width: '10%',
                  textAlign: 'left',
                  padding: '1rem',
                }}
              >
                Tool calling (Claude + MCP)
              </th>
              <th
                style={{
                  width: '30%',
                  textAlign: 'left',
                  padding: '1rem',
                }}
              >
                Comment
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => (
              <tr key={idx} style={{ borderTopWidth: `1px !important` }}>
                {row.prompt !== '' && (
                  <td rowSpan={3} style={{ padding: `1rem` }} dangerouslySetInnerHTML={{ __html: row.prompt }} />
                )}
                <td style={{ padding: `1rem`, minWidth: `120px` }}>
                  <div style={{ minWidth: `88px` }}>{renderHeatmapGrid(row.promptql, 5)}</div>
                </td>
                <td style={{ padding: `1rem`, minWidth: `120px` }}>
                  <div style={{ minWidth: `88px` }}>{renderHeatmapGrid(row.claude, 5)}</div>
                </td>
                <td className="p-4 font-sm text-sm" dangerouslySetInnerHTML={{ __html: row.comment }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
