import { ComponentType } from 'react';

export interface DemoCardProps {
  IconComponent: ComponentType<{ className?: string }>;
  href: string;
  title: string;
  description: string;
}

export default function DemoCard({ IconComponent, href, title, description }: DemoCardProps) {
  return (
    <a href={href} className="demo-box" target="_blank">
      <div className="icon-wrapper">
        <IconComponent className="demo-icon" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="demo-cta-button" data-demo-industry={title.toLowerCase()}>
        Explore the {title} demo
      </div>
    </a>
  );
}
