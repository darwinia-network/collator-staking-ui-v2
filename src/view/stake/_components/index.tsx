import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/react';
import useStakingAccountWithStatus from '@/hooks/useStakingAccountWithStatus';
import useWalletStatus from '@/hooks/useWalletStatus';
import StakeList from './list';
import NewStake from './new';
import ManageStake from './manage';

import type { StakingAccountWithStatus } from '@/hooks/useStakingAccountWithStatus';

const StakePage = () => {
  const { currentChain, isEnabled } = useWalletStatus();
  const [current, setCurrent] = useState<StakingAccountWithStatus | null>(null);
  const [isNewStakeOpen, setIsNewStakeOpen] = useState(false);
  const [isEditStakeOpen, setIsEditStakeOpen] = useState(false);

  const {
    data: stakingAccount,
    isLoading: isStakingAccountLoading,
    refetch: refetchStakingAccount
  } = useStakingAccountWithStatus();

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

  return (
    <>
      <div className="flex flex-col gap-[1.25rem]">
        <StakeList
          data={stakingAccount}
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
        onSuccess={refetchStakingAccount}
      />
      {current?.collator && (
        <ManageStake
          isOpen={isEditStakeOpen}
          symbol={currentChain?.nativeCurrency.symbol || ''}
          collator={current?.collator}
          onClose={handleCloseEditStake}
          onSuccess={refetchStakingAccount}
        />
      )}
    </>
  );
};

export default StakePage;
