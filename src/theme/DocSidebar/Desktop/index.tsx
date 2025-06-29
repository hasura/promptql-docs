import React from 'react';
import { useLocation } from '@docusaurus/router';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import Link from '@docusaurus/Link';
import {
  buildCategories,
  isActiveLink,
  hasActiveChild,
  type Category,
} from '../utils'; 
import '../CustomSidebar.css'; 

interface ContentProps {
  path: string;
  sidebar: PropSidebarItem[];
}

export default function Content({ sidebar }: ContentProps) {
  const location = useLocation();
  const categories: Category[] = buildCategories(sidebar);

  const renderSidebarItem = (item: PropSidebarItem): React.ReactElement => {
    if (item.type === 'link') {
      const href = (item as any).href || '';
      const isActive = isActiveLink(href, location.pathname);
      return (
        <Link
          to={href}
          className={`custom-sidebar__link ${isActive ? 'custom-sidebar__link--active' : ''}`}
        >
          {(item as any).label || 'Untitled'}
        </Link>
      );
    }
    
    if (item.type === 'category') {
      const items = (item as any).items;
      if (items && Array.isArray(items)) {
        const shouldExpand = hasActiveChild(items, location.pathname);
        return (
          <details className="custom-sidebar__collapsible" open={shouldExpand}>
            <summary className="custom-sidebar__folder-title">
              {(item as any).label || 'Untitled Category'}
            </summary>
            <ul className="custom-sidebar__subitems">
              {items.map((subItem: PropSidebarItem, subIndex: number) => (
                <li key={subIndex}>{renderSidebarItem(subItem)}</li>
              ))}
            </ul>
          </details>
        );
      }
    }
    
    return <span>{(item as any).label || 'Unknown item'}</span>;
  };

  const renderCategory = (category: Category) => (
    <div key={category.id} className="custom-sidebar__category">
      <h3 className="custom-sidebar__category-title">{category.title}</h3>
      <div className="custom-sidebar__category-content">
        {category.items.length === 0 ? (
          <p className="custom-sidebar__empty">No items yet</p>
        ) : (
          <div className="custom-sidebar__items">
            {category.items.map((item, index) => (
              <div key={index} className="custom-sidebar__item">
                {renderSidebarItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div 
      className="custom-sidebar"
      role="navigation"
      aria-label="Documentation sidebar"
    >
      <div className="custom-sidebar__content">
        {categories.map(renderCategory)}
      </div>
    </div>
  );
}
