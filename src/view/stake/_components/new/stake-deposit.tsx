import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Divider, Button } from '@nextui-org/react';
import DepositList, { DepositListRef } from '@/components/deposit-list';
import useWalletStatus from '@/hooks/useWalletStatus';
import TransactionStatus from '@/components/transaction-status';
import { useApprovalForAll, useDepositStake, useIsApprovedForAll } from '../../_hooks/stake';
import type { CollatorSet } from '@/service/type';
import type { DepositInfo } from '@/hooks/useUserDepositDetails';
import { error } from '@/components/toast';

interface StakeDepositProps {
  selectedCollator?: CollatorSet;
  onSuccess?: () => void;
}

const StakeDeposit = ({ selectedCollator, onSuccess }: StakeDepositProps) => {
  const depositListRef = useRef<DepositListRef>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
  const [checkedDeposits, setCheckedDeposits] = useState<DepositInfo[]>([]);
  const { ringDAOGovernance } = useWalletStatus();

  const {
    data: isApprovedForAll,
    isLoading: isLoadingIsApprovedForAll,
    refetch: refetchIsApprovedForAll
  } = useIsApprovedForAll();

  const { handleApprovalForAll, isPending: isPendingApprovalForAll } = useApprovalForAll();

  const {
    handleStake: handleDepositStake,
    isLoadingOldAndNewPrev: isLoadingOldAndNewPrevDeposit,
    isPending: isPendingDepositStake
  } = useDepositStake({
    collator: selectedCollator,
    deposits: checkedDeposits
  });

  const handleStake = useCallback(async () => {
    if (!isApprovedForAll) {
      const tx = await handleApprovalForAll()?.catch((e) => {
        error(e.shortMessage);
      });
      if (tx) {
        setApprovalHash(tx);
      }
    } else {
      const tx = await handleDepositStake()?.catch((e) => {
        error(e.shortMessage);
      });
      if (tx) {
        setHash(tx);
      }
    }
  }, [handleApprovalForAll, isApprovedForAll, handleDepositStake]);

  const handleApprovalTransactionSuccess = useCallback(async () => {
    refetchIsApprovedForAll();
    const tx = await handleDepositStake()?.catch((e) => {
      error(e.shortMessage);
    });
    if (tx) {
      setApprovalHash(undefined);
      setHash(tx);
    }
  }, [handleDepositStake, refetchIsApprovedForAll]);

  const handleStakeTransactionSuccess = useCallback(() => {
    depositListRef.current?.resetAndRefetch();
    setCheckedDeposits([]);
    setApprovalHash(undefined);
    setHash(undefined);
    onSuccess?.();
  }, [onSuccess]);

  const handleStakeTransactionFail = useCallback(() => {
    setApprovalHash(undefined);
    setHash(undefined);
  }, []);

  const handleApprovalTransactionFail = useCallback(() => {
    setApprovalHash(undefined);
  }, []);

  const isDisabled = useMemo(() => {
    if (!selectedCollator) {
      return true;
    }
    return checkedDeposits.length === 0;
  }, [checkedDeposits, selectedCollator]);

  const isLoading = useMemo(() => {
    if (!isApprovedForAll) {
      return isLoadingOldAndNewPrevDeposit || isLoadingIsApprovedForAll || isPendingApprovalForAll;
    } else {
      return isLoadingOldAndNewPrevDeposit || isLoadingIsApprovedForAll || isPendingDepositStake;
    }
  }, [
    isLoadingOldAndNewPrevDeposit,
    isLoadingIsApprovedForAll,
    isApprovedForAll,
    isPendingDepositStake,
    isPendingApprovalForAll
  ]);

  const buttonText = useMemo(() => {
    if (!isApprovedForAll) {
      return 'Approve';
    }
    return 'Stake';
  }, [isApprovedForAll]);

  useEffect(() => {
    return () => {
      setCheckedDeposits([]);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5">
        <DepositList ref={depositListRef} onCheckedDepositsChange={setCheckedDeposits} />
        <Divider />
        <p className="m-0 text-[0.75rem] font-normal text-foreground/50">
          Both staked Deposit and Deposit can be used to participate in{' '}
          <span className="text-[0.75rem]">{ringDAOGovernance?.name}</span>.
        </p>
        <Button
          color="primary"
          isDisabled={isDisabled}
          onClick={handleStake}
          isLoading={isLoading}
          className="w-full font-bold"
        >
          {buttonText}
        </Button>
      </div>
      <TransactionStatus
        hash={approvalHash}
        title="Approval"
        onSuccess={handleApprovalTransactionSuccess}
        onFail={handleApprovalTransactionFail}
        isLoading={isPendingDepositStake}
      />
      <TransactionStatus
        hash={hash}
        title="Staking"
        onSuccess={handleStakeTransactionSuccess}
        onFail={handleStakeTransactionFail}
      />
    </>
  );
};

export default StakeDeposit;
