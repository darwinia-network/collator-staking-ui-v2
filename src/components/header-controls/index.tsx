import { useRef, useEffect } from 'react';
import { useMedia } from 'react-use';

import MobileControls from './mobile-controls';
import DesktopControls from './desktop-controls';

import type { MobileControlsProps } from './mobile-controls';

export function HeaderControls() {
  const mobileRef = useRef<MobileControlsProps>(null);
  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    if (!isMobile) {
      mobileRef.current?.closeDrawer();
    }
  }, [isMobile]);

  if (isMobile) {
    return <MobileControls ref={mobileRef} />;
  }
  return <DesktopControls />;
}
