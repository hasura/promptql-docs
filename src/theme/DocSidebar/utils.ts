import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import { CATEGORY_CONFIG } from './categories';

export interface Category {
  id: string;
  title: string;
  items: PropSidebarItem[];
}

/**
 * Extract directory name from a Docusaurus path
 */
export const getDirectoryFromPath = (path: string): string => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const segments = cleanPath.split('/');
  
  if (segments[0] === 'docs' && segments.length > 1) {
    return segments[1];
  }
  return segments[0] || '';
};

/**
 * Get the primary directory for an item (handles nested categories)
 */
export const getPrimaryDirectory = (item: PropSidebarItem): string => {
  if (item.type === 'link') {
    const href = (item as any).href;
    if (href) {
      return getDirectoryFromPath(href);
    }
  }
  
  if (item.type === 'category') {
    // Check if the category itself has an href
    const href = (item as any).href;
    if (href) {
      return getDirectoryFromPath(href);
    }
    
    // Otherwise, get the directory from the first child item
    const items = (item as any).items;
    if (items && Array.isArray(items) && items.length > 0) {
      return getPrimaryDirectory(items[0]);
    }
  }
  
  return '';
};

/**
 * Recursively sort items within a category based on directory order
 */
export const sortItemsByDirectoryOrder = (
  items: PropSidebarItem[],
  directoryOrder: readonly string[],
  exactMatch: boolean = false
): PropSidebarItem[] => {
  return items
    .map(item => {
      // If this is a category, recursively sort its children
      if (item.type === 'category') {
        const childItems = (item as any).items;
        if (childItems && Array.isArray(childItems)) {
          return {
            ...item,
            items: sortItemsByDirectoryOrder(childItems, directoryOrder, exactMatch)
          };
        }
      }
      return item;
    })
    .sort((a, b) => {
      const aPrimaryDir = getPrimaryDirectory(a);
      const bPrimaryDir = getPrimaryDirectory(b);
      
      let aIndex = -1;
      let bIndex = -1;
      
      if (exactMatch) {
        aIndex = directoryOrder.indexOf(aPrimaryDir);
        bIndex = directoryOrder.indexOf(bPrimaryDir);
      } else {
        // For non-exact match, find the first directory that contains the pattern
        aIndex = directoryOrder.findIndex(dir => aPrimaryDir.includes(dir));
        bIndex = directoryOrder.findIndex(dir => bPrimaryDir.includes(dir));
      }
      
      // Items not found in the directory order go to the end
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
};

/**
 * Check if a sidebar item matches any of the given patterns
 */
export const itemMatchesPattern = (
  item: PropSidebarItem, 
  patterns: readonly string[], 
  exactMatch: boolean = false
): boolean => {
  return patterns.some(pattern => {
    if (item.type === 'link') {
      const href = (item as any).href;
      if (href) {
        const directory = getDirectoryFromPath(href);
        if (exactMatch) {
          return directory === pattern;
        } else {
          return directory.includes(pattern);
        }
      }
    }
    
    if (item.type === 'category') {
      const href = (item as any).href;
      if (href) {
        const directory = getDirectoryFromPath(href);
        if (exactMatch) {
          if (directory === pattern) return true;
        } else {
          if (directory.includes(pattern)) return true;
        }
      }
      
      const items = (item as any).items;
      if (items && Array.isArray(items)) {
        const hasMatchingChild = items.some((subItem: any) => {
          if (subItem.type === 'link' && subItem.href) {
            const directory = getDirectoryFromPath(subItem.href);
            if (exactMatch) {
              return directory === pattern;
            } else {
              return directory.includes(pattern);
            }
          }
          return false;
        });
        if (hasMatchingChild) {
          return true;
        }
      }
    }
    
    return false;
  });
};

/**
 * Filter sidebar items that match the given category configuration
 */
export const getItemsForCategory = (
  sidebar: PropSidebarItem[], 
  categoryConfig: readonly string[], 
  exactMatch: boolean = false
): PropSidebarItem[] => {
  if (!sidebar || !Array.isArray(sidebar)) return [];
  const matchedItems = sidebar.filter((item: PropSidebarItem) => {
    return itemMatchesPattern(item, categoryConfig, exactMatch);
  });
  return matchedItems;
};

/**
 * Build categories from the configuration
 */
export const buildCategories = (sidebar: PropSidebarItem[]): Category[] => {
  return Object.entries(CATEGORY_CONFIG).map(([id, config]) => {
    const matchedItems = getItemsForCategory(sidebar, config.directories, config.exactMatch);
    
    // Sort items recursively by directory order
    const sortedItems = sortItemsByDirectoryOrder(matchedItems, config.directories, config.exactMatch);
    
    return {
      id,
      title: config.title,
      items: sortedItems,
    };
  });
};

/**
 * Check if a link is currently active based on the current pathname
 */
export const isActiveLink = (href: string, currentPathname: string): boolean => {
  return currentPathname === href || currentPathname.startsWith(href + '/');
};

/**
 * Check if a category has any active child items
 */
export const hasActiveChild = (items: PropSidebarItem[], pathname: string): boolean => {
  return items.some(item => {
    if (item.type === 'link') {
      const href = (item as any).href;
      return pathname.startsWith(href); // deep match
    }
    if (item.type === 'category') {
      return hasActiveChild((item as any).items || [], pathname);
    }
    return false;
  });
};
