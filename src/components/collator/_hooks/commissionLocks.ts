import { useReadContract } from 'wagmi';
import { address as hubAddress, abi as hubAbi } from '@/config/abi/hub';
import { useMemo } from 'react';

export const useCommissionLocks = (address: `0x${string}`) => {
  const result = useReadContract({
    address: hubAddress,
    abi: hubAbi,
    functionName: 'commissionLocks',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address
    }
  });

  const isLockPeriod = useMemo(() => {
    const locked = result?.data ?? 0n;
    const now = BigInt(Math.floor(Date.now() / 1000));

    console.log('locked', locked);
    console.log('now', now);

    return locked > now;
  }, [result.data]);

  return {
    isLockPeriod,
    lockEndTime: result.data,
    isLoading: result.isLoading,
    refetch: result.refetch
  };
};
