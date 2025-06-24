import React from 'react';
import { useLocation } from '@docusaurus/router';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import { 
  buildCategories, 
  isActiveLink, 
  hasActiveChild,
  type Category 
} from './utils';
import './CustomSidebar.css';

// Import logo
import Logo from '@site/static/img/pql-logo-large.svg';

// Import icons
import GettingStarted from '@site/static/icons/home-smile.svg';
import PromptQL from '@site/static/icons/features/prompt-ql.svg';
import DataModeling from '@site/static/icons/features/data-modeling.svg';
import Deployment from '@site/static/icons/features/deployment.svg';
import Recipe from '@site/static/icons/beaker.svg';
import Help from '@site/static/icons/features/hasura_policies.svg';

interface CustomSidebarProps {
  sidebar: PropSidebarItem[];
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ sidebar }) => {
  const location = useLocation();
  const categories: Category[] = buildCategories(sidebar);

  // Icon mapping function
  const getCategoryIcon = (categoryId: string) => {
    const iconStyle = {
      width: '16px',
      height: '16px',
      display: 'block',
    };

    switch (categoryId) {
      case 'gettingStarted':
        return <GettingStarted style={iconStyle} />;
      case 'coreConcepts':
        return <PromptQL style={iconStyle} />;
      case 'buildingApps':
        return <DataModeling style={iconStyle} />;
      case 'deployment':
        return <Deployment style={iconStyle} />;
      case 'guides':
        return <Recipe style={iconStyle} />;
      case 'reference':
        return <Help style={iconStyle} />;
      default:
        return null;
    }
  };

  const renderSidebarItem = (item: PropSidebarItem): React.ReactElement => {
    if (item.type === 'link') {
      const href = (item as any).href || '';
      const isActive = isActiveLink(href, location.pathname);
      
      return (
        <a 
          href={href} 
          className={`custom-sidebar__link ${isActive ? 'custom-sidebar__link--active' : ''}`}
        >
          {(item as any).label || 'Untitled'}
        </a>
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
                <li key={subIndex}>
                  {renderSidebarItem(subItem)}
                </li>
              ))}
            </ul>
          </details>
        );
      }
    }
    
    return <span>{(item as any).label || 'Unknown item'}</span>;
  };

  const renderCategory = (category: Category) => {
    const icon = getCategoryIcon(category.id);
    
    return (
      <div key={category.id} className="custom-sidebar__category">
        <h3 className="custom-sidebar__category-title">
          {icon && (
            <div className="sidebar-icon" style={{ marginRight: '8px', display: 'inline-block' }}>
              {icon}
            </div>
          )}
          <span>{category.title}</span>
        </h3>
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
  };

  return (
    <div className="custom-sidebar">
      <div className="custom-sidebar__logo">
        <Logo />
      </div>
      <div className="custom-sidebar__content">
        {categories.map(renderCategory)}
      </div>
    </div>
  );
};

export default CustomSidebar;
