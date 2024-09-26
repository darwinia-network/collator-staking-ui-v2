import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip
} from '@nextui-org/react';
import { X } from 'lucide-react';

import { useCallback, useRef, useState, ReactNode } from 'react';

import type { StakedDepositInfo } from '../../_hooks/staked';
import UnstakeDepositList, { DepositListRef } from '@/components/unstake-deposit-list';
import TransactionStatus from '@/components/transaction-status';
import { useUnstakeDeposits } from '../../_hooks/unstake';
import { CollatorSet } from '@/service/type';
import { error } from '@/components/toast';

interface EditStakeProps {
  isOpen: boolean;
  collator?: CollatorSet;
  symbol: string;
  deposits: StakedDepositInfo[];
  isLocked?: boolean;
  onClose: () => void;
  onOk: () => void;
  renderDays?: ReactNode;
}

const UnstakeDeposits = ({
  isOpen,
  collator,
  deposits,
  isLocked,
  renderDays,
  onClose,
  onOk
}: EditStakeProps) => {
  const depositListRef = useRef<DepositListRef>(null);
  const [checkedDeposits, setCheckedDeposits] = useState<StakedDepositInfo[]>([]);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { unstakeDeposits, isLoadingOldAndNewPrev, isPending } = useUnstakeDeposits({
    collator,
    deposits: checkedDeposits
  });

  const handleUnstakeStart = useCallback(async () => {
    const tx = await unstakeDeposits()?.catch((e) => {
      error(e.shortMessage);
    });
    if (tx) {
      setHash(tx);
    }
  }, [unstakeDeposits]);

  const handleSuccess = useCallback(() => {
    setHash(undefined);
    onOk?.();
  }, [onOk]);

  const handleFail = useCallback(() => {
    setHash(undefined);
  }, []);

  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="bg-background"
        classNames={{
          closeButton:
            'p-0 top-[1.35rem] right-[1.35rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent'
        }}
        closeButton={<X strokeWidth={1.5} />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] px-5 py-0 md:w-[25rem]">
          <ModalHeader className="px-0 py-5 text-[1.125rem] text-foreground">
            Unstake deposits
          </ModalHeader>
          <Divider />
          <ModalBody className="flex w-full flex-col items-center justify-center gap-5 px-0 py-5">
            <UnstakeDepositList
              ref={depositListRef}
              onCheckedDepositsChange={setCheckedDeposits}
              deposits={deposits}
              isDisabled={isLocked}
            />
            {isLocked ? (
              <Tooltip
                content={
                  <div className="max-w-[16.25rem] p-2 text-[0.75rem] font-normal text-foreground">
                    You can perform the unstake operation {renderDays} after your last stake with
                    the selected collator. You have {renderDays} remaining before you can unstake.
                  </div>
                }
                closeDelay={0}
                color="default"
                showArrow
              >
                <div className="w-full">
                  {
                    <Button
                      color="primary"
                      className="w-full"
                      onClick={handleUnstakeStart}
                      isDisabled
                      isLoading={isPending || isLoadingOldAndNewPrev}
                    >
                      Unstake
                    </Button>
                  }
                </div>
              </Tooltip>
            ) : (
              <Button
                color="primary"
                className="w-full"
                onClick={handleUnstakeStart}
                isDisabled={!checkedDeposits.length}
                isLoading={isPending || isLoadingOldAndNewPrev}
              >
                Unstake
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <TransactionStatus
        hash={hash}
        onFail={handleFail}
        onSuccess={handleSuccess}
        title="Unstake"
      />
    </>
  );
};

export default UnstakeDeposits;
