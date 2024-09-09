import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { X } from 'lucide-react';

import { useCallback, useRef, useState } from 'react';

import type { StakedDepositInfo } from '../../_hooks/staked';
import UnstakeDepositList, { DepositListRef } from '@/components/unstake-deposit-list';
import TransactionStatus from '@/components/transaction-status';
import { useUnstakeDeposits } from '../../_hooks/unstake';
import { CollatorSet } from '@/service/type';

interface EditStakeProps {
  isOpen: boolean;
  collators: CollatorSet[];
  targetCollator: `0x${string}`;
  symbol: string;
  deposits: StakedDepositInfo[];
  onClose: () => void;
  onOk: () => void;
}

const UnstakeDeposits = ({
  isOpen,
  collators,
  targetCollator,
  deposits,
  onClose,
  onOk
}: EditStakeProps) => {
  const depositListRef = useRef<DepositListRef>(null);
  const [checkedDeposits, setCheckedDeposits] = useState<StakedDepositInfo[]>([]);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { unstakeDeposits, isLoadingOldAndNewPrev, isPending } = useUnstakeDeposits({
    collatorList: collators,
    collator: targetCollator,
    deposits: checkedDeposits
  });

  const handleUnstakeStart = useCallback(async () => {
    const tx = await unstakeDeposits();
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
            />

            <Button
              color="primary"
              className="w-full"
              onClick={handleUnstakeStart}
              isDisabled={!checkedDeposits.length}
              isLoading={isPending || isLoadingOldAndNewPrev}
            >
              Unstake
            </Button>
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
