import { useCallback, memo, useEffect, useState, useMemo } from 'react';
import { Button, Divider, Spinner } from '@nextui-org/react';
import { useWatchAsset } from 'wagmi';
import { parseEther } from 'viem';
import AmountInputWithBalance from '@/components/amount-input-with-balance';
import useBalance from '@/hooks/useBalance';
import useWalletStatus from '@/hooks/useWalletStatus';
import TransactionStatus from '@/components/transaction-status';
import { error } from '@/components/toast';
import useCheckWaitingIndexing from '@/hooks/useWaitingIndexing';
import { useRingStake } from '../../_hooks/stake';
import type { CollatorSet } from '@/service/type';

interface StakeRingProps {
  selectedCollator?: CollatorSet;
  onSuccess?: () => void;
}

const StakeRing = ({ selectedCollator, onSuccess }: StakeRingProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const [amount, setAmount] = useState<string>('0');
  const { checkWaitingIndexing, isLoading: isLoadingWaitingIndexing } = useCheckWaitingIndexing();
  const { watchAsset, isPending: isPendingWatchAsset } = useWatchAsset();
  const { ringDAOGovernance, gringTokenInfo } = useWalletStatus();
  const {
    formatted,
    isLoading: isLoadingBalance,
    data: balance,
    refetch: refetchBalance
  } = useBalance();

  const assets = useMemo(() => {
    return !!amount && amount !== '0' ? parseEther(amount) : 0n;
  }, [amount]);

  const resetBalanceAndAmount = useCallback(() => {
    setAmount('0');
    refetchBalance();
  }, [refetchBalance]);

  const {
    handleStake: handleRingStake,
    isLoadingOldAndNewPrev: isLoadingOldAndNewPrevRing,
    isPending: isPendingRingStake
  } = useRingStake({
    collator: selectedCollator,
    assets
  });

  const handleStake = useCallback(async () => {
    const { isDeployed } = await checkWaitingIndexing();

    if (!isDeployed) {
      return;
    }
    const tx = await handleRingStake()?.catch((e) => {
      error(e.shortMessage || 'Failed to stake');
    });

    if (tx) {
      setHash(tx);
    }
  }, [handleRingStake, checkWaitingIndexing]);

  const handleTransactionSuccess = useCallback(() => {
    resetBalanceAndAmount();
    setHash(undefined);
    onSuccess?.();
  }, [resetBalanceAndAmount, onSuccess]);

  const handleTransactionFail = useCallback(() => {
    setHash(undefined);
  }, []);

  const isDisabled = useMemo(() => {
    if (!selectedCollator) {
      return true;
    }
    return assets === 0n;
  }, [selectedCollator, assets]);

  const isLoading = useMemo(() => {
    return isLoadingOldAndNewPrevRing || isPendingRingStake || isLoadingBalance;
  }, [isLoadingOldAndNewPrevRing, isPendingRingStake, isLoadingBalance]);

  useEffect(() => {
    return () => {
      setAmount('0');
    };
  }, []);

  const handleAddToken = useCallback(() => {
    watchAsset({
      type: 'ERC20',
      options: gringTokenInfo!
    });
  }, [watchAsset, gringTokenInfo]);

  return (
    <>
      <div className="flex w-full flex-col gap-5">
        <AmountInputWithBalance
          symbol={balance?.symbol}
          balance={formatted}
          isLoading={isLoadingBalance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Divider />
        <div className="m-0 text-[0.75rem] font-normal text-foreground/50">
          Please note that staking has a lock-up period, and you can only unstake after 24 hours.
          Stake RING to automatically receive{' '}
          <div
            className={`relative inline-flex items-center gap-1 text-[0.75rem] text-[#0094FF] transition-opacity hover:opacity-80 ${
              isPendingWatchAsset
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={handleAddToken}
          >
            {isPendingWatchAsset && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Spinner
                  size="sm"
                  classNames={{
                    wrapper: 'w-3 h-3'
                  }}
                />
              </div>
            )}
            <span>{gringTokenInfo?.symbol}</span>
            <img src="/images/common/metamask.svg" alt="metamask" className="inline size-4" />
          </div>
          , which allows you to participate in{' '}
          <span className="text-[0.75rem]">{ringDAOGovernance?.name}</span>.
        </div>
        <p className="m-0 text-[0.75rem] font-normal text-foreground/50">
          Please note that gRING is non-transferable.
        </p>
        <Button
          color="primary"
          isDisabled={isDisabled}
          onClick={handleStake}
          isLoading={isLoading || isLoadingWaitingIndexing}
          className="w-full font-bold"
        >
          Stake
        </Button>
      </div>
      <TransactionStatus
        hash={hash}
        title="Staking"
        onSuccess={handleTransactionSuccess}
        onFail={handleTransactionFail}
      />
    </>
  );
};

export default memo(StakeRing);
