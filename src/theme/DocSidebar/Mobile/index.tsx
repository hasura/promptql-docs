import React from 'react';
import clsx from 'clsx';
import {
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/DocSidebar/Mobile';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import {
  buildCategories,
  type Category,
} from '../utils'; 
import '../CustomSidebar.css';

const DocSidebarMobileSecondaryMenu: NavbarSecondaryMenuComponent<Props> = ({
  sidebar,
}) => {
  const location = useLocation();
  const mobileSidebar = useNavbarMobileSidebar();
  const categories: Category[] = buildCategories(sidebar as PropSidebarItem[]);
  const indentUnit = 20;

  const normalize = (path: string) => path.replace(/\/+/g, '/').replace(/\/+$/, '');
  const currentPath = normalize(location.pathname);

  const isActiveLink = (href: string): boolean => {
    const cleanHref = normalize(href);
    return (
      currentPath === cleanHref ||
      currentPath.startsWith(cleanHref + '/')
    );
  };

  const hasActiveChild = (items: PropSidebarItem[]): boolean => {
    return items.some(item => {
      if (item.type === 'link') {
        const href = (item as any).href || '';
        return isActiveLink(href);
      }
      if (item.type === 'category') {
        const href = (item as any).href || '';
        if (href && isActiveLink(href)) {
          return true;
        }
        const children = (item as any).items || [];
        return hasActiveChild(children);
      }
      return false;
    });
  };

  const renderSidebarItem = (
    item: PropSidebarItem,
    depth = 0
  ): React.ReactElement => {
    // LINK ITEM
    if (item.type === 'link') {
      const href = (item as any).href || '';
      const isActive = isActiveLink(href);
      return (
        <Link
          to={href}
          className={`custom-sidebar__link ${
            isActive ? 'custom-sidebar__link--active' : ''
          }`}
          style={{ paddingLeft: depth * indentUnit + 'px' }}
          onClick={() => mobileSidebar.toggle()}
        >
          {(item as any).label || 'Untitled'}
        </Link>
      );
    }

    // CATEGORY ITEM
    if (item.type === 'category') {
      const items = (item as any).items;
      if (Array.isArray(items)) {
        const href = (item as any).href || '';
        const isActive = href ? isActiveLink(href) : false;
        const shouldExpand = isActive || hasActiveChild(items);

        return (
          <div className="custom-sidebar__collapsible">
            <Link
              to={href}
              className={`custom-sidebar__link ${
                isActive ? 'custom-sidebar__link--active' : ''
              }`}
              style={{ paddingLeft: depth * indentUnit + 'px' }}
              onClick={() => mobileSidebar.toggle()}
            >
              {(item as any).label || 'Untitled Category'}
            </Link>
            <ul
              className={`custom-sidebar__subitems ${
                shouldExpand ? 'custom-sidebar__subitems--active' : ''
              }`}
            >
              {items.map((subItem: PropSidebarItem, idx: number) => (
                <li key={idx}>
                  {renderSidebarItem(subItem, depth + 1)}
                </li>
              ))}
            </ul>
          </div>
        );
      }
    }

    return (
      <span style={{ paddingLeft: depth * indentUnit + 'px' }}>
        {(item as any).label || 'Unknown item'}
      </span>
    );
  };

  const renderCategory = (category: Category) => (
    <div key={category.id} className="custom-sidebar__category">
      <h3 className="custom-sidebar__category-title">
        {category.title}
      </h3>
      <div className="custom-sidebar__category-content">
        {category.items.length === 0 ? (
          <p className="custom-sidebar__empty">No items yet</p>
        ) : (
          <div className="custom-sidebar__items">
            {category.items.map((item, index) => (
              <div key={index} className="custom-sidebar__item">
                {renderSidebarItem(item, 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={clsx(ThemeClassNames.docs.docSidebarMenu, 'custom-sidebar custom-sidebar--mobile')}>
      <div className="custom-sidebar__content">
        {categories.map(renderCategory)}
      </div>
    </div>
  );
};

function DocSidebarMobile(props: Props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
