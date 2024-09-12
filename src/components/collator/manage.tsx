import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tooltip } from '@nextui-org/react';
import { CircleHelp } from 'lucide-react';
import { validSessionKey } from '@/utils';
import { useCollatorByAddress, useCollatorSetPrev } from '@/hooks/useService';
import useWalletStatus from '@/hooks/useWalletStatus';
import { DEFAULT_PREV } from '@/utils/getPrevNew';
import TransactionStatus from '../transaction-status';
import StopCollation from './stop-collation';
import useStop from './_hooks/stop';
import { useSetSessionKey } from './_hooks/set-session-key';
import useUpdateCommission from './_hooks/update-commission';
import { useCommissionLockInfo } from './_hooks/commissionLockInfo';
import { error } from '../toast';
interface CollatorManagementProps {
  sessionKey: string;
  commissionOf: bigint;
  refetch: () => void;
  onStopSuccess: () => void;
}
const CollatorManagement = ({
  sessionKey,
  commissionOf,
  refetch,
  onStopSuccess
}: CollatorManagementProps) => {
  const { address } = useWalletStatus();
  const [open, setOpen] = useState(false);
  const [isValidSessionKey, setIsValidSessionKey] = useState(true);
  const [sessionKeyHash, setSessionKeyHash] = useState('');
  const [commissionHash, setCommissionHash] = useState('');
  const [stopHash, setStopHash] = useState('');
  const [sessionKeyValue, setSessionKeyValue] = useState('');
  const [commissionValue, setCommissionValue] = useState('');

  const { data: collatorByAddress, isLoading: isLoadingCollatorByAddress } = useCollatorByAddress({
    address: address as `0x${string}`,
    enabled: true
  });
  const currentCollator = collatorByAddress?.[0];
  const oldKey = currentCollator?.key || '';
  const collatorAddress = currentCollator?.address;
  const totalAssets = useMemo(() => {
    const assets = currentCollator?.assets;
    return assets ? BigInt(assets) : BigInt(0);
  }, [currentCollator]);

  const {
    data: collatorSetPrev,
    isLoading: isLoadingPrev,
    isRefetching: isRefetchingPrev
  } = useCollatorSetPrev({
    key: oldKey,
    enabled: !!oldKey
  });

  const oldPrev = (
    collatorSetPrev?.[0] ? collatorSetPrev?.[0]?.address : DEFAULT_PREV
  ) as `0x${string}`;

  const { isLockPeriod, isLockPeriodLoading, remainingLockTime } = useCommissionLockInfo();

  const { setSessionKey, isPending: isPendingSetSessionKey } = useSetSessionKey();

  const {
    updateCommission,
    isPending: isPendingUpdateCommission,
    isLoading: isLoadingUpdateCommission
  } = useUpdateCommission({
    newCommission: BigInt(commissionValue),
    oldKey,
    oldPrev,
    collatorAddress: collatorAddress as `0x${string}`,
    totalAssets
  });

  const { stop, isPending: isPendingStop } = useStop();

  const isSameSessionKey = useMemo(() => {
    return sessionKey === sessionKeyValue;
  }, [sessionKey, sessionKeyValue]);

  const handleChangeSessionKeyValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidSessionKey(true);
    setSessionKeyValue(e.target.value);
  }, []);

  const handleCommissionBlur = useCallback(() => {
    if (!commissionValue) {
      return;
    }
    const commission = Number(commissionValue);
    setCommissionValue(Math.min(Math.max(commission, 0), 100).toString());
  }, [commissionValue]);

  const handleChangeCommissionValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCommissionValue(e.target.value);
  }, []);

  const handleSetSessionKey = useCallback(async () => {
    if (validSessionKey(sessionKeyValue)) {
      const tx = await setSessionKey(sessionKeyValue)?.catch((e) => {
        error(e.shortMessage);
      });
      if (tx) {
        setSessionKeyHash(tx);
      }
    } else {
      setIsValidSessionKey(false);
    }
  }, [sessionKeyValue, setSessionKey]);

  const handleSetSessionKeySuccess = useCallback(() => {
    setSessionKeyHash('');
    setSessionKeyValue('');
    refetch?.();
  }, [refetch]);

  const handleSetSessionKeyError = useCallback(() => {
    setSessionKeyHash('');
  }, []);

  const handleSetCommission = useCallback(async () => {
    const tx = await updateCommission()?.catch((e) => {
      error(e.shortMessage);
    });
    if (tx) {
      setCommissionHash(tx);
    }
  }, [updateCommission]);

  const handleSetCommissionSuccess = useCallback(() => {
    setCommissionHash('');
  }, []);

  const handleSetCommissionError = useCallback(() => {
    setCommissionHash('');
  }, []);

  const handleStop = useCallback(async () => {
    const tx = await stop({ address: oldPrev })?.catch((e) => {
      error(e.shortMessage);
    });
    if (tx) {
      setStopHash(tx);
    }
  }, [stop, oldPrev]);

  const handleStopSuccess = useCallback(() => {
    setStopHash('');
    onStopSuccess?.();
  }, [onStopSuccess]);

  const handleStopError = useCallback(() => {
    setStopHash('');
  }, []);

  useEffect(() => {
    return () => {
      setSessionKeyValue('');
      setCommissionValue('');
      setIsValidSessionKey(true);
    };
  }, [commissionOf, sessionKey]);

  return (
    <div className="flex flex-col gap-[1.25rem]">
      <div className="space-y-[0.62rem]">
        <div className="relative flex flex-col gap-[0.69rem] rounded-medium bg-secondary p-[0.62rem]">
          <div className="text-[0.75rem] font-normal text-foreground/50">Session Key</div>
          <div className="relative flex h-6 items-center justify-between">
            <input
              type="text"
              placeholder="Enter Session Key"
              className="w-full appearance-none bg-transparent text-[1rem] font-bold placeholder:text-[0.875rem] placeholder:font-bold placeholder:text-[#c6c6c6] hover:bg-transparent focus-visible:outline-none"
              value={sessionKeyValue}
              onChange={handleChangeSessionKeyValue}
            />
          </div>
        </div>
        {isValidSessionKey ? null : <div className="text-xs text-red-500">Invalid Session Key</div>}
        {isSameSessionKey && (
          <div className="text-xs text-red-500">
            The session key cannot be the same as the one already set.
          </div>
        )}
        <Button
          color="primary"
          className="h-[2.125rem] w-full"
          isDisabled={!sessionKeyValue || isSameSessionKey}
          isLoading={isPendingSetSessionKey}
          onClick={handleSetSessionKey}
        >
          Update Session Key
        </Button>
      </div>
      <div className="space-y-[0.62rem]">
        <div className="relative flex flex-col gap-[0.69rem] rounded-medium bg-secondary p-[0.62rem]">
          <div className="flex items-center gap-1 text-[0.75rem] font-normal text-foreground/50">
            <span>Commission(%)</span>
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
              className="w-full appearance-none bg-transparent text-[1rem] font-bold placeholder:text-[0.875rem] placeholder:font-bold placeholder:text-[#c6c6c6] hover:bg-transparent focus-visible:outline-none"
              value={commissionValue}
              onChange={handleChangeCommissionValue}
              onBlur={handleCommissionBlur}
            />
            <span>%</span>
          </div>
        </div>
        {isLockPeriod ? (
          <Tooltip
            content={
              <div className="flex max-w-[16.25rem] items-center justify-center p-2 text-[0.75rem] font-normal text-foreground/50">
                You can perform the update commssion operation 7 days after your last set commssion.
                You have {remainingLockTime} remaining before you can update.
              </div>
            }
            closeDelay={0}
            color="default"
            showArrow
          >
            <div>
              <Button color="primary" className="h-[2.125rem] w-full" isDisabled>
                Update Commission
              </Button>
            </div>
          </Tooltip>
        ) : (
          <Button
            color="primary"
            className="h-[2.125rem] w-full"
            isDisabled={!commissionValue}
            onClick={handleSetCommission}
            isLoading={
              isPendingUpdateCommission ||
              isLockPeriodLoading ||
              isLoadingUpdateCommission ||
              isLoadingPrev ||
              isRefetchingPrev ||
              isLoadingCollatorByAddress
            }
          >
            Update Commission
          </Button>
        )}
      </div>

      <Button
        color="primary"
        className="h-[2.125rem] w-full"
        variant="light"
        isLoading={isPendingStop}
        onClick={handleStop}
      >
        Stop Collation
      </Button>
      <StopCollation isOpen={open} onClose={() => setOpen(false)} />
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
      <TransactionStatus
        hash={stopHash as `0x${string}`}
        onSuccess={handleStopSuccess}
        onFail={handleStopError}
        title="Stop Collation"
      />
    </div>
  );
};

export default CollatorManagement;
