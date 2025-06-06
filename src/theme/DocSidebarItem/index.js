import React from 'react';
import DocSidebarItemCategory from '@theme/DocSidebarItem/Category';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import DocSidebarItemHtml from '@theme/DocSidebarItem/Html';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DocSidebarItem({ item, ...props }) {
  switch (item.type) {
    case 'category':
      if (item.customProps?.sidebar_pathname) {
        // if there is a custom sidebar_pathname, use it
        item.href = useBaseUrl(item.customProps.sidebar_pathname + '/overview/');
      } else if (item.href === undefined) {
        // if there is no custom sidebar_pathname, use the label with our regex
        item.href = useBaseUrl(item.label.toLowerCase().replace(/\s/g, '-') + '/overview/');
      } else {
        // if it already has a href (such as any category that has an index within the dir), use it
        item.href = item.href;
      }
      return <DocSidebarItemCategory item={item} {...props} />;
    case 'html':
      return <DocSidebarItemHtml item={item} {...props} />;
    case 'link':
    default:
      return <DocSidebarItemLink item={item} {...props} />;
  }
}
