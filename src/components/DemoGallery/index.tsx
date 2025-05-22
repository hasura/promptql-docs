import { useState } from 'react';
import type { DemoCardProps } from './card';
import DemoCard from './card';
import CellTower from '@site/static/icons/general/cell-tower.svg';
import Handshake from '@site/static/icons/general/handshake.svg';
import Banking from '@site/static/icons/general/banking.svg';
import Healthcare from '@site/static/icons/general/healthcare.svg';

const DEMOS: DemoCardProps[] = [
  {
    title: 'GTM',
    href: 'https://promptql.console.hasura.io/public/sandbox-gtm/readme',
    description:
      'See how sales and marketing teams leverage PromptQL to understand customer journeys, analyze pipeline data, and drive strategic business decisions.',
    IconComponent: Handshake,
  },
  {
    title: 'Healthcare',
    href: 'https://promptql.console.hasura.io/public/sandbox-healthcare/readme',
    description:
      'Discover how healthcare providers use PromptQL to analyze patient data, optimize care pathways, and improve operational efficiency while maintaining compliance.',
    IconComponent: Healthcare,
  },
  {
    title: 'AML',
    href: 'https://promptql.console.hasura.io/public/sandbox-aml/readme',
    description:
      'Explore how financial institutions use PromptQL to streamline anti-money laundering (AML) efforts by analyzing transaction data, uncovering suspicious patterns, and enhancing compliance.',
    IconComponent: Banking,
  },
  {
    title: 'Telco',
    href: 'https://promptql.console.hasura.io/public/sandbox-telco/readme',
    description:
      'Take a look at the global network of a telecommunications provider and see how customers, call logs, service requests, devices, and support ticketing are all orchestrated into a single, capable agent.',
    IconComponent: CellTower,
  },
];

export default function DemoGallery() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <p>
        Check out these demos to get a feel for how PromptQL works. Each of these will take you to a README outlining
        the connected data sources and will suggest some ways of interacting with the application.
      </p>
      <div className={`homepage-demo-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="homepage-demo-grid">
          {DEMOS.map((demo, index) => (
            <DemoCard key={index} {...demo} />
          ))}
        </div>
        {!isExpanded && <div className="demo-fade-overlay" />}
      </div>
      <div className="demo-expand-controls">
        <button
          className="demo-expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Show less demos' : 'Show more demos'}
        >
          <svg
            className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>
      </div>
    </>
  );
}
