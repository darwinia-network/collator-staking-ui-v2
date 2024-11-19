import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Tab, Tabs, Spinner } from '@nextui-org/react';
import { X } from 'lucide-react';

import { collatorTabs } from '@/config/tabs';

import { TransitionPanel } from '../transition-panel';
import usePreview from './_hooks/preview';
import CollatorJoin from './join';
import CollatorManagement from './manage';
import CollatorOverview from './overview';

import type { Key } from '@/types/ui';

interface CollatorTabsProps {
  onClose: () => void;
  isOpen?: boolean;
}
const CollatorTabs = ({ onClose, isOpen }: CollatorTabsProps) => {
  const {
    hasSessionKey,
    sessionKey,
    commissionOf,
    hasPool,
    isRegisteredCollator,
    isLoading,
    refetch: refetchPreview
  } = usePreview();

  const tabs = useMemo(() => {
    if (isRegisteredCollator) {
      return collatorTabs?.filter((tab) => tab.key !== 'join');
    }
    return collatorTabs?.filter((tab) => tab.key !== 'overview');
  }, [isRegisteredCollator]);

  const [selected, setSelected] = useState<Key>(tabs[0].key);

  const refetch = useCallback(async () => {
    await refetchPreview();
  }, [refetchPreview]);

  const handleStopSuccess = useCallback(async () => {
    await refetch();
    setSelected(tabs[0].key);
  }, [refetch, tabs]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          closeButton:
            'p-0 top-[1.35rem] right-[1.35rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent'
        }}
        className="bg-background"
        closeButton={<X strokeWidth={1.5} />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] gap-5 md:w-[25rem]">
          <ModalHeader className="px-5 pb-0 pt-5 text-[1.125rem] font-bold text-foreground">
            <span>Collator</span>
          </ModalHeader>

          <ModalBody className="relative flex flex-col gap-[1.25rem] p-0 px-5 pb-5">
            {/* todo  */}
            {/* Animation is not working when tabs are used inside a modal. */}
            {/* https://github.com/nextui-org/nextui/issues/2297 */}
            {/* https://github.com/framer/motion/issues/1302 */}
            <Tabs
              aria-label="Options"
              color="primary"
              variant="underlined"
              className="-mt-4"
              selectedKey={selected as Key}
              onSelectionChange={setSelected}
              classNames={{
                tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                cursor: 'w-full bg-foreground font-bold',
                tab: 'max-w-fit px-0 h-12 !outline-none',
                tabContent: 'group-data-[selected=true]:text-foreground  font-bold'
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  isDisabled={!isRegisteredCollator && tab.key === 'manage'}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{tab.label}</span>
                    </div>
                  }
                ></Tab>
              ))}
            </Tabs>
            <TransitionPanel
              activeIndex={selected === 'join' ? 0 : selected === 'overview' ? 1 : 2}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              variants={{
                enter: { opacity: 0, filter: 'blur(4px)' },
                center: { opacity: 1, filter: 'blur(0px)' },
                exit: { opacity: 0, filter: 'blur(4px)' }
              }}
            >
              {selected === 'join' && (
                <CollatorJoin
                  hasSessionKey={hasSessionKey}
                  sessionKey={sessionKey}
                  hasPool={hasPool}
                  refetch={refetch}
                />
              )}
              {selected === 'overview' && (
                <CollatorOverview sessionKey={sessionKey} commissionOf={commissionOf} />
              )}
              {selected === 'manage' && (
                <CollatorManagement
                  sessionKey={sessionKey}
                  commissionOf={commissionOf}
                  refetch={refetch}
                  onStopSuccess={handleStopSuccess}
                />
              )}
            </TransitionPanel>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Spinner />
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CollatorTabs;
