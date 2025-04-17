import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';

// Inline CSS instead of importing from module
const menuHtmlItemClass = 'docSidebarItem-menuHtmlItem';

export default function DocSidebarItemHtml({ item, level, index }) {
  const { value, defaultStyle, className } = item;
  return (
    <>
      {/* Inline style definition */}
      {defaultStyle && (
        <style>
          {`
            @media (min-width: 997px) {
              .${menuHtmlItemClass} {
                padding: var(--ifm-menu-link-padding-vertical)
                  var(--ifm-menu-link-padding-horizontal);
              }
            }
          `}
        </style>
      )}
      <li
        className={clsx(
          ThemeClassNames.docs.docSidebarItemLink,
          ThemeClassNames.docs.docSidebarItemLinkLevel(level),
          defaultStyle && [menuHtmlItemClass, 'menu__list-item'],
          className
        )}
        key={index}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  );
}
