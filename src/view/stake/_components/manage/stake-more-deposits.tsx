import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { X } from 'lucide-react';

import DepositList, { DepositListRef } from '@/components/deposit-list';
import { useCallback, useRef, useState } from 'react';
import { DepositInfo } from '@/hooks/useUserDepositDetails';
import { useApprovalForAll, useDepositStake, useIsApprovedForAll } from '../../_hooks/stake';
import { CollatorSet } from '@/service/type';
import TransactionStatus from '@/components/transaction-status';
import { error } from '@/components/toast';

interface EditStakeProps {
  isOpen: boolean;
  collator?: CollatorSet;
  onClose: () => void;
  onOk: () => void;
}

const StakeMoreDeposits = ({ isOpen, collator, onClose, onOk }: EditStakeProps) => {
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    data: isApprovedForAll,
    isLoading: isLoadingIsApprovedForAll,
    refetch: refetchIsApprovedForAll
  } = useIsApprovedForAll();
  const { handleApprovalForAll, isPending: isPendingApprovalForAll } = useApprovalForAll();

  const depositListRef = useRef<DepositListRef>(null);
  const [checkedDeposits, setCheckedDeposits] = useState<DepositInfo[]>([]);

  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const {
    handleStake: handleDepositStake,
    isLoadingOldAndNewPrev: isLoadingOldAndNewPrevDeposit,
    isPending: isPendingDepositStake
  } = useDepositStake({
    collator,
    deposits: checkedDeposits
  });

  const handleDepositApproval = useCallback(async () => {
    const tx = await handleApprovalForAll()?.catch((e) => {
      error(e.shortMessage);
    });
    if (tx) {
      setApprovalHash(tx);
    }
  }, [handleApprovalForAll]);

  const handleDepositStakeStart = useCallback(async () => {
    refetchIsApprovedForAll();
    const tx = await handleDepositStake()?.catch((e) => {
      error(e.shortMessage);
    });
    if (tx) {
      setApprovalHash(undefined);
      setHash(tx);
    }
  }, [handleDepositStake, refetchIsApprovedForAll]);

  const handleDepositFail = useCallback(() => {
    setHash(undefined);
  }, []);

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
        backdrop="blur"
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
              onClick={isApprovedForAll ? handleDepositStakeStart : handleDepositApproval}
              isDisabled={checkedDeposits?.length === 0}
              isLoading={
                isLoadingOldAndNewPrevDeposit ||
                isPendingDepositStake ||
                isLoadingIsApprovedForAll ||
                isPendingApprovalForAll
              }
            >
              {isApprovedForAll ? 'Stake' : 'Approve'}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TransactionStatus hash={hash} onFail={handleFail} onSuccess={handleSuccess} title="Stake" />
      <TransactionStatus
        hash={approvalHash}
        title="Approval"
        onSuccess={handleDepositStakeStart}
        onFail={handleDepositFail}
        isLoading={isPendingDepositStake || isPendingApprovalForAll}
      />
    </>
  );
};

export default StakeMoreDeposits;
