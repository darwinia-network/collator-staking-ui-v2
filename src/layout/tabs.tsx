import { useCallback, useMemo } from 'react';
import { Modal, ModalBody, ModalContent, Tab, Tabs } from '@nextui-org/react';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { defiTabs } from '@/config/tabs';
import useWalletStatus from '@/hooks/useWalletStatus';
import { ChainId } from '@/types/chains';

export default function DefiTabs({ children }: { children: React.ReactNode }) {
  const { currentChainId } = useWalletStatus();
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
          tab: 'max-w-fit px-0 h-12 !outline-none',
          tabContent: 'group-data-[selected=true]:text-foreground'
        }}
        selectedKey={selectKey}
        onSelectionChange={(key) => {
          if (key) {
            switchTab(key as string);
          }
        }}
      >
        {defiTabs.map((tab) => (
          <Tab
            key={tab.key}
            as="div"
            title={
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
      <div className="mt-[1.25rem] w-full">{children}</div>
      {currentChainId === ChainId.DARWINIA && (
        <Modal backdrop="blur" isOpen hideCloseButton>
          <ModalContent className="h-[calc(100vw-1.24rem)] max-h-[28rem] w-[calc(100vw-1.24rem)] p-0 md:h-[25rem] md:w-[25rem]">
            {() => (
              <>
                <ModalBody className="flex h-full w-full flex-col items-center justify-center p-5">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-5">
                    <img src="/images/common/fail-icon.svg" alt="fail-icon" className="size-20" />
                    <div className="flex flex-col items-center justify-center gap-[0.62rem]">
                      <p className="text-center text-[1.125rem] font-bold text-foreground">
                        This network is not supported yet.
                      </p>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
