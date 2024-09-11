import { useCallback, memo, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Divider, Link, Spinner } from '@nextui-org/react';
import { useWatchAsset } from 'wagmi';

import AmountInputWithBalance from '@/components/amount-input-with-balance';
import useBalance from '@/hooks/useBalance';
import useWalletStatus from '@/hooks/useWalletStatus';

interface StakeRingProps {
  className?: string;
  onAmountChange?: (amount: string) => void;
}

export type StakeRingRef = {
  resetBalanceAndAmount: () => void;
};
const StakeRing = forwardRef<StakeRingRef, StakeRingProps>(({ className, onAmountChange }, ref) => {
  const { watchAsset, isPending } = useWatchAsset();
  const { ringDAOGovernanceUrl, gringTokenInfo } = useWalletStatus();
  const [amount, setAmount] = useState<string | undefined>('0');
  const { formatted, isLoading, data: balance, refetch: refetchBalance } = useBalance();

  const handleAddToken = useCallback(() => {
    watchAsset({
      type: 'ERC20',
      options: gringTokenInfo!
    });
  }, [watchAsset, gringTokenInfo]);

  const resetBalanceAndAmount = useCallback(() => {
    setAmount('0');
    refetchBalance();
  }, [setAmount, refetchBalance]);

  useImperativeHandle(
    ref,
    () => ({
      resetBalanceAndAmount
    }),
    [resetBalanceAndAmount]
  );

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value);
      onAmountChange?.(e.target.value);
    },
    [setAmount, onAmountChange]
  );

  useEffect(() => {
    resetBalanceAndAmount();
  }, [resetBalanceAndAmount]);

  return (
    <div className="flex w-full flex-col gap-5">
      <AmountInputWithBalance
        className={className}
        symbol={balance?.symbol}
        balance={formatted}
        isLoading={isLoading}
        value={amount}
        onChange={handleAmountChange}
      />
      <Divider />
      <div className="m-0 text-[0.75rem] font-normal text-foreground/50">
        Please note that staking has a lock-up period, and you can only unstake after 24 hours.
        Stake RING to automatically receive{' '}
        <div
          className={`relative inline-flex items-center gap-1 text-[0.75rem] text-[#0094FF] transition-opacity hover:opacity-80 ${
            isPending ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          onClick={handleAddToken}
        >
          {isPending && (
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
        <Link
          href={ringDAOGovernanceUrl}
          className="text-[0.75rem] text-[#0094FF]"
          target="_blank"
          rel="noopener noreferrer"
        >
          RingDAO governance
        </Link>
      </div>
      <p className="m-0 text-[0.75rem] font-normal text-foreground/50">
        Please note that gRING is non-transferable
      </p>
    </div>
  );
});

export default memo(StakeRing);
