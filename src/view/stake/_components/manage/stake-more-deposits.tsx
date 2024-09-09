import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { X } from 'lucide-react';

import DepositList, { DepositListRef } from '@/components/deposit-list';
import { useCallback, useRef, useState } from 'react';
import { DepositInfo } from '@/hooks/useUserDepositDetails';
import { useDepositStake } from '../../_hooks/stake';
import { CollatorSet } from '@/service/type';
import TransactionStatus from '@/components/transaction-status';

interface EditStakeProps {
  isOpen: boolean;
  collators: CollatorSet[];
  targetCollator: `0x${string}`;
  onClose: () => void;
  onOk: () => void;
}

const StakeMoreDeposits = ({
  isOpen,
  collators,
  targetCollator,
  onClose,
  onOk
}: EditStakeProps) => {
  const depositListRef = useRef<DepositListRef>(null);
  const [checkedDeposits, setCheckedDeposits] = useState<DepositInfo[]>([]);

  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const {
    handleStake: handleDepositStake,
    isLoadingOldAndNewPrev: isLoadingOldAndNewPrevDeposit,
    isPending: isPendingDepositStake
  } = useDepositStake({
    collators,
    targetCollator,
    deposits: checkedDeposits
  });

  const handleDepositStakeStart = useCallback(async () => {
    const tx = await handleDepositStake();
    if (tx) {
      setHash(tx);
    }
  }, [handleDepositStake]);

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
            Stake more deposits
          </ModalHeader>
          <Divider />
          <ModalBody className="flex w-full flex-col items-center justify-center gap-5 px-0 py-5">
            <DepositList ref={depositListRef} onCheckedDepositsChange={setCheckedDeposits} />
            <Divider />
            <Button
              color="primary"
              className="w-full"
              onClick={handleDepositStakeStart}
              isDisabled={checkedDeposits?.length === 0}
              isLoading={isLoadingOldAndNewPrevDeposit || isPendingDepositStake}
            >
              Stake
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TransactionStatus hash={hash} onFail={handleFail} onSuccess={handleSuccess} title="Stake" />
    </>
  );
};

export default StakeMoreDeposits;
