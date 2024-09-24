import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/react';
import useStakingAccountWithStatus from '@/hooks/useStakingAccountWithStatus';
import useWalletStatus from '@/hooks/useWalletStatus';
import StakeList from './list';
import NewStake from './new';
import StakeManagementModal from './manage';

import type { StakingAccountWithStatus } from '@/hooks/useStakingAccountWithStatus';

const StakePage = () => {
  const { currentChain, isEnabled } = useWalletStatus();
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [current, setCurrent] = useState<StakingAccountWithStatus | null>(null);
  const [isNewStakeOpen, setIsNewStakeOpen] = useState(false);
  const [isEditStakeOpen, setIsEditStakeOpen] = useState(false);

  const {
    data: stakingAccount,
    isLoading: isStakingAccountLoading,
    refetch: refetchStakingAccount
  } = useStakingAccountWithStatus();

  //   // Use a timer to prevent issues with delayed indexing of stakingAccount data
  const handleRefetchStakingAccount = useCallback(() => {
    if (refetchTimerRef.current) {
      clearTimeout(refetchTimerRef.current);
    }
    refetchTimerRef.current = setTimeout(() => {
      refetchStakingAccount();
      refetchTimerRef.current = null;
    }, 1000);
  }, [refetchStakingAccount]);

  const handleCloseNewStake = useCallback(() => {
    setIsNewStakeOpen(false);
  }, []);

  const handleCloseEditStake = useCallback(() => {
    setIsEditStakeOpen(false);
  }, []);

  const handleClick = useCallback((item: StakingAccountWithStatus) => {
    setCurrent(item);
    setIsEditStakeOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      if (refetchTimerRef.current) {
        clearTimeout(refetchTimerRef.current);
      }
    };
  }, []);

  // filter data
  const stakingAccountFiltered = stakingAccount?.length
    ? stakingAccount.filter((item) => BigInt(item?.assets ?? '0') > 0n)
    : [];

  return (
    <>
      <div className="flex flex-col gap-[1.25rem]">
        <StakeList
          data={stakingAccountFiltered}
          isLoading={isStakingAccountLoading}
          onClick={handleClick}
        />

        <div className="flex flex-col gap-[0.62rem]">
          <Button
            className="w-full"
            color="primary"
            onClick={() => setIsNewStakeOpen(true)}
            isDisabled={!isEnabled}
          >
            New Stake
          </Button>
        </div>
      </div>
      <NewStake
        isOpen={isNewStakeOpen}
        onClose={handleCloseNewStake}
        onSuccess={handleRefetchStakingAccount}
      />
      {current?.collator && (
        <StakeManagementModal
          isOpen={isEditStakeOpen}
          symbol={currentChain?.nativeCurrency.symbol || ''}
          collatorAddress={current?.collator}
          onClose={handleCloseEditStake}
          onSuccess={handleRefetchStakingAccount}
        />
      )}
    </>
  );
};

export default StakePage;
