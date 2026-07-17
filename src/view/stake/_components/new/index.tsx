import { useCallback, useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, cn, Divider } from '@nextui-org/react';
import { ChevronDown, X } from 'lucide-react';

import Avatar from '@/components/avatar';
import { useAddressOrEns } from '@/utils';

import StakeRing from './stake-ring';
import SelectCollator from './collator-selection-modal';

import type { CollatorSet } from '@/service/type';

interface NewStakeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  isOpen?: boolean;
}
const NewStakeModal = ({ onClose, isOpen, onSuccess }: NewStakeModalProps) => {
  const [selectedCollator, setSelectedCollator] = useState<CollatorSet | undefined>(undefined);
  const [selectCollatorOpen, setSelectCollatorOpen] = useState(false);

  const handleSelectCollatorChange = useCallback((collator: CollatorSet) => {
    setSelectedCollator(collator);
    if (collator) {
      setSelectCollatorOpen(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectCollatorOpen(false);
  }, []);

  const formattedAddress = useAddressOrEns(selectedCollator?.address || '');

  useEffect(() => {
    if (!isOpen) {
      setSelectedCollator(undefined);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
        className="bg-background"
        classNames={{
          closeButton:
            'p-0 top-[1.35rem] right-[1.35rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent'
        }}
        closeButton={<X strokeWidth={1.5} />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] gap-5 md:w-[25rem]">
          <ModalHeader className="px-5 pb-0 pt-5 text-[1.125rem] font-bold text-foreground">
            <span>New Stake</span>
          </ModalHeader>
          <div className="px-5">
            <Divider />
          </div>
          <ModalBody className="flex flex-col gap-[1.25rem] p-0 px-5 pb-5">
            <div
              className="flex cursor-pointer flex-col gap-[0.625rem] rounded-medium bg-secondary p-[0.62rem] transition-all hover:opacity-[var(--nextui-hover-opacity)] active:scale-[1.01]"
              onClick={() => setSelectCollatorOpen(true)}
            >
              <div className="text-[0.75rem] font-normal text-foreground/50">Collator</div>
              <div className="flex items-center justify-between">
                {selectedCollator?.address ? (
                  <div className="flex items-center gap-[0.62rem]">
                    <Avatar address={selectedCollator.address} className="size-[1.625rem]" />
                    <div className="text-[0.875rem] font-bold text-foreground">
                      {/* {useAddressOrEns(selectedCollator.address)} */}
                      {selectedCollator?.address ? formattedAddress : 'Select a collator'}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-[0.62rem]">
                    <>
                      <div className="size-[1.625rem] rounded-full bg-[#c6c6c6]"></div>
                      <div className="text-[0.875rem] font-bold text-foreground">
                        Select a collator
                      </div>
                    </>
                  </div>
                )}

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    'transform transition-transform',
                    selectCollatorOpen ? 'rotate-180' : 'rotate-0'
                  )}
                />
              </div>
            </div>
            <StakeRing selectedCollator={selectedCollator} onSuccess={onSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <SelectCollator
        isOpen={selectCollatorOpen}
        onClose={handleClose}
        selectedCollator={selectedCollator}
        onSelectCollatorChange={handleSelectCollatorChange}
      />
    </>
  );
};

export default NewStakeModal;
