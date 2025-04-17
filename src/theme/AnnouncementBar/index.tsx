import React, { type ReactNode, useEffect, useState } from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useAnnouncementBar } from '@docusaurus/theme-common/internal';
import { useColorMode } from '@docusaurus/theme-common';
import AnnouncementBarContent from '@theme/AnnouncementBar/Content';
import AnnouncementBarCloseBtn from '@site/static/icons/x-close.svg';
import AnnouncementBarCloseBtnDark from '@site/static/icons/x-close-dark.svg';

import styles from './styles.module.css';

export default function AnnouncementBar(): ReactNode {
  const { announcementBar } = useThemeConfig();
  const { isActive, close } = useAnnouncementBar();
  const { colorMode } = useColorMode();
  const [definedColorMode, setDefinedColorMode] = useState('');

  useEffect(() => {
    setDefinedColorMode(colorMode);
  }, [colorMode]);

  const isDarkMode = definedColorMode === 'dark';

  if (!isActive) {
    return null;
  }

  const { backgroundColor, textColor, isCloseable } = announcementBar!;

  return (
    <div className={styles.announcementWrapper}>
      <div className={styles.announcementBar} style={{ backgroundColor, color: textColor }} role="banner">
        {isCloseable && (
          <div onClick={close} className={styles.announcementBarClose}>
            {isDarkMode ? <AnnouncementBarCloseBtnDark /> : <AnnouncementBarCloseBtn />}
          </div>
        )}
        <AnnouncementBarContent className={styles.announcementBarContent} />
      </div>
    </div>
  );
}
