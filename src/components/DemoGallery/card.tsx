import { ComponentType } from 'react';

export interface DemoCardProps {
  IconComponent: ComponentType<{ className?: string }>;
  href: string;
  title: string;
  description: string;
}

export default function DemoCard({ IconComponent, href, title, description }: DemoCardProps) {
  return (
    <div className="demo-box">
      <div className="icon-wrapper">
        <IconComponent className="demo-icon" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={href} target="_blank" className="demo-cta-button" data-demo-industry={title.toLowerCase()}>
        Explore the {title} demo
      </a>
    </div>
  );
}
