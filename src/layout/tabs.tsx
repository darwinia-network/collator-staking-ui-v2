import { useCallback, useMemo } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { defiTabs } from '@/config/tabs';

export default function DefiTabs({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const switchTab = useCallback(
    (key: string) => {
      navigate({ to: `/${key}` });
    },
    [navigate]
  );

  const selectKey = useMemo(() => {
    if (pathname === '/') return 'stake';
    return pathname.split('/')[1];
  }, [pathname]);

  return (
    <>
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: 'gap-5 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-foreground',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-foreground'
        }}
        selectedKey={selectKey}
      >
        {defiTabs.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div
                className="flex items-center space-x-2"
                onClick={() => {
                  switchTab(tab.key);
                }}
              >
                <span>{tab.label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
      <div className="mt-[1.25rem] w-full">{children}</div>
    </>
  );
}
