import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { address as hubAddress, abi as hubAbi } from '@/config/abi/hub';
import useWalletStatus from '@/hooks/useWalletStatus';

export const useCommissionLocks = () => {
  const { isEnabled, address } = useWalletStatus();
  const result = useReadContract({
    address: hubAddress,
    abi: hubAbi,
    functionName: 'commissionLocks',
    args: [address as `0x${string}`],
    query: {
      enabled: isEnabled
    }
  });

  const isLockPeriod = useMemo(() => {
    const locked = (result?.data as bigint) ?? 0n;
    const now = BigInt(Math.floor(Date.now() / 1000));

    return locked > now;
  }, [result.data]);

  return {
    isLockPeriod,
    lockEndTime: result.data,
    isLoading: result.isLoading,
    refetch: result.refetch
  };
};
