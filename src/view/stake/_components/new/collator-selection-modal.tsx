import { useState, useCallback } from 'react';
import { Modal, ModalBody, ModalContent, Tab, Tabs } from '@nextui-org/react';
import { X } from 'lucide-react';
import { selectCollatorTabs } from '@/config/tabs';
import SelectCollatorSelectionTable from './collator-active-selection-table';
import SelectCollatorWaitingSelectionTable from './collator-waiting-selection-table';
import useWalletStatus from '@/hooks/useWalletStatus';
import type { Key } from '@/types/ui';
import type { CollatorSet } from '@/service/type';

interface CollatorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCollator?: CollatorSet;
  onSelectCollatorChange: (collator: CollatorSet) => void;
  onChangePage?: (page: number) => void;
}

const CollatorSelectionModal = ({
  isOpen,
  onClose,
  selectedCollator,
  onSelectCollatorChange,
  onChangePage
}: CollatorSelectionModalProps) => {
  const { currentChain } = useWalletStatus();
  const [selected, setSelected] = useState<Key>(selectCollatorTabs[0].key);

  const handleTabChange = useCallback(
    (key: Key) => {
      setSelected(key);
      onChangePage?.(1);
    },
    [onChangePage]
  );

  const handleSelectCollatorChange = useCallback(
    (collator: CollatorSet) => {
      if (collator) {
        onSelectCollatorChange(collator);
      }
    },
    [onSelectCollatorChange]
  );

  return (
    <>
      <Modal
        placement="center"
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        className="bg-background"
        classNames={{
          closeButton:
            'p-0 top-[1.25rem] right-[1.25rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent  z-10'
        }}
        closeButton={<X />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] md:max-w-[58.125rem]">
          <ModalBody className="p-5">
            <Tabs
              aria-label="Options"
              color="primary"
              variant="underlined"
              selectedKey={selected}
              onSelectionChange={handleTabChange}
              className="-mt-3"
              classNames={{
                tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                cursor: 'w-full bg-foreground font-bold',
                tab: 'max-w-fit px-0 h-12',
                tabContent: 'group-data-[selected=true]:text-foreground  font-bold'
              }}
            >
              {selectCollatorTabs.map((tab) => (
                <Tab
                  key={tab.key}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{tab.label}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
            {selected === 'active-pool' ? (
              <SelectCollatorSelectionTable
                symbol={currentChain?.nativeCurrency?.symbol || 'RING'}
                selectedCollator={selectedCollator}
                onSelectCollatorChange={handleSelectCollatorChange}
              />
            ) : (
              <SelectCollatorWaitingSelectionTable
                symbol={currentChain?.nativeCurrency?.symbol || 'RING'}
                selectedCollator={selectedCollator}
                onSelectCollatorChange={handleSelectCollatorChange}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CollatorSelectionModal;
