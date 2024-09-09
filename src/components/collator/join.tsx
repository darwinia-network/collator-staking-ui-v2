import { Link } from '@tanstack/react-router';
import { Button, Tooltip } from '@nextui-org/react';
import { CircleHelp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TransactionStatus from '../transaction-status';
import { useSetSessionKey } from './_hooks/set-session-key';
import { CollatorSet } from '@/service/type';
import { useCreateCollator, useCreateAndCollator } from './_hooks/collator';
import useWalletStatus from '@/hooks/useWalletStatus';
import { validSessionKey } from '@/utils';

interface JoinCollatorProps {
  hasSessionKey: boolean;
  sessionKey: string;
  hasPool: boolean;
  collators: CollatorSet[];
  refetch: () => void;
}

const JoinCollator = ({
  hasSessionKey,
  sessionKey,
  hasPool,
  collators,
  refetch
}: JoinCollatorProps) => {
  const { address: account } = useWalletStatus();

  const [isValidSessionKey, setIsValidSessionKey] = useState(true);
  const [sessionKeyHash, setSessionKeyHash] = useState('');
  const [commissionHash, setCommissionHash] = useState('');
  const [sessionKeyValue, setSessionKeyValue] = useState('');
  const [commissionValue, setCommissionValue] = useState('');

  const { setSessionKey, isPending: isPendingSetSessionKey } = useSetSessionKey();
  const { createCollator, isPending: isPendingCreateCollator } = useCreateCollator();
  const { createAndCollator, isPending: isPendingCreateAndCollator } = useCreateAndCollator();

  const prev = useMemo(() => {
    if (!collators?.length) {
      return '0x0000000000000000000000000000000000000000' as `0x${string}`;
    }

    const filteredCollators = collators.filter(
      (collator: CollatorSet) => collator.address && collator.address !== account
    );
    return filteredCollators.length > 0
      ? (filteredCollators[filteredCollators.length - 1].address as `0x${string}`)
      : ('0x0000000000000000000000000000000000000000' as `0x${string}`);
  }, [collators, account]);

  const handleChangeSessionKeyValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidSessionKey(true);
    setSessionKeyValue(e.target.value);
  }, []);

  const handleChangeCommissionValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCommissionValue(e.target.value);
  }, []);

  const handleCommissionBlur = useCallback(() => {
    const commission = Number(commissionValue);
    setCommissionValue(Math.min(Math.max(commission, 0), 100).toString());
  }, [commissionValue]);

  const handleSetSessionKey = useCallback(async () => {
    if (validSessionKey(sessionKeyValue)) {
      const tx = await setSessionKey(sessionKeyValue);
      if (tx) {
        setSessionKeyHash(tx);
      }
    } else {
      setIsValidSessionKey(false);
    }
  }, [sessionKeyValue, setSessionKey]);

  const handleSetSessionKeySuccess = useCallback(() => {
    setSessionKeyHash('');
    refetch?.();
  }, [refetch]);

  const handleSetSessionKeyError = useCallback(() => {
    setSessionKeyHash('');
  }, []);

  const handleSetCommission = useCallback(async () => {
    if (hasPool) {
      const tx = await createCollator({
        prev,
        commission: BigInt(commissionValue)
      });
      if (tx) {
        setCommissionHash(tx);
      }
    } else {
      const tx = await createAndCollator({
        prev,
        commission: BigInt(commissionValue)
      });
      if (tx) {
        setCommissionHash(tx);
      }
    }
  }, [hasPool, commissionValue, createCollator, createAndCollator, prev]);

  const handleSetCommissionSuccess = useCallback(() => {
    setCommissionHash('');
    refetch?.();
  }, [refetch]);

  const handleSetCommissionError = useCallback(() => {
    setCommissionHash('');
  }, []);

  useEffect(() => {
    return () => {
      setSessionKeyValue('');
      setCommissionValue('');
      setIsValidSessionKey(true);
    };
  }, []);
  return (
    <div className="flex flex-col gap-[1.25rem]">
      <p className="text-[0.75rem] font-normal text-foreground/50">
        Note that you need to complete two steps in sequence, setup [Session Key] and setup
        [Commission] before becoming a collator. Please{' '}
        <Link href="/" className="text-[#0094FF]">
          Run A Node
        </Link>{' '}
        first and get the session key of your running node.
      </p>
      <div className="space-y-[0.62rem]">
        <div className="relative flex flex-col gap-[0.69rem] rounded-medium bg-secondary p-[0.62rem]">
          <div className="text-[0.75rem] font-normal text-foreground/50">Step1: Session Key</div>
          <div className="relative flex h-6 items-center justify-between">
            {hasSessionKey ? (
              <input
                type="text"
                disabled={hasSessionKey && !!sessionKey}
                placeholder="Enter Session Key"
                className="w-full appearance-none bg-transparent text-[1rem] font-bold placeholder:text-[0.875rem] placeholder:font-bold placeholder:text-[#c6c6c6] hover:bg-transparent focus-visible:outline-none"
                value={sessionKey}
              />
            ) : (
              <input
                type="text"
                placeholder="Enter Session Key"
                className="w-full appearance-none bg-transparent text-[1rem] font-bold placeholder:text-[0.875rem] placeholder:font-bold placeholder:text-[#c6c6c6] hover:bg-transparent focus-visible:outline-none"
                value={sessionKeyValue}
                onChange={handleChangeSessionKeyValue}
              />
            )}
          </div>
        </div>
        {isValidSessionKey ? null : <div className="text-xs text-red-500">Invalid Session Key</div>}
        {hasSessionKey ? null : (
          <Button
            color="primary"
            className="h-[2.125rem] w-full"
            isDisabled={hasSessionKey || !sessionKeyValue}
            onClick={handleSetSessionKey}
            isLoading={isPendingSetSessionKey}
          >
            Set Session Key
          </Button>
        )}
      </div>
      <div className="space-y-[0.62rem]">
        <div className="relative flex flex-col gap-[0.69rem] rounded-medium bg-secondary p-[0.62rem]">
          <div className="flex items-center gap-1 text-[0.75rem] font-normal text-foreground/50">
            <span>Step2: Commission(%)</span>
            <Tooltip
              content={
                <div className="flex max-w-[16.25rem] items-center justify-center p-2 text-[0.75rem] font-normal text-foreground/50">
                  The percent a collator takes off the top of the due staking rewards.
                </div>
              }
              closeDelay={0}
              color="default"
              showArrow
            >
              <CircleHelp size={14} strokeWidth={1} className="cursor-pointer" />
            </Tooltip>
          </div>
          <div className="relative flex h-6 items-center justify-between">
            <input
              type="number"
              placeholder="0"
              className="w-full appearance-none bg-transparent pr-16 text-[1rem] font-bold placeholder:text-[0.875rem] placeholder:font-bold placeholder:text-[#c6c6c6] hover:bg-transparent focus-visible:outline-none"
              value={commissionValue}
              onChange={handleChangeCommissionValue}
              onBlur={handleCommissionBlur}
            />
            <span>%</span>
          </div>
        </div>

        <Button
          color="primary"
          className="h-[2.125rem] w-full"
          isDisabled={!hasSessionKey || !commissionValue || !commissionValue}
          onClick={handleSetCommission}
          isLoading={isPendingCreateCollator || isPendingCreateAndCollator}
        >
          {hasPool ? 'Collate' : 'Create Nomination Pool & Collate'}
        </Button>
        <TransactionStatus
          hash={sessionKeyHash as `0x${string}`}
          onSuccess={handleSetSessionKeySuccess}
          onFail={handleSetSessionKeyError}
          title="Set Session Key"
        />
        <TransactionStatus
          hash={commissionHash as `0x${string}`}
          onSuccess={handleSetCommissionSuccess}
          onFail={handleSetCommissionError}
          title="Set Commission"
        />
      </div>
    </div>
  );
};

export default JoinCollator;
