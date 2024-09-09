import { address as hubAddress, abi as hubAbi } from '@/config/abi/hub';
import { address as collatorAddress, abi as collatorAbi } from '@/config/abi/collator';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useReadContracts } from 'wagmi';
import { useMemo } from 'react';
import { twox64Concat } from '@/utils/twox64Concat';
import { fromBytes } from 'viem';

function usePreview() {
  const { address } = useWalletStatus();

  const results = useReadContracts({
    contracts: [
      {
        address: hubAddress,
        abi: hubAbi,
        functionName: 'commissionOf',
        args: [address as `0x${string}`]
      },
      {
        address: hubAddress,
        abi: hubAbi,
        functionName: 'poolOf',
        args: [address as `0x${string}`]
      },
      {
        address: collatorAddress,
        abi: collatorAbi,
        functionName: 'getSessionKey',
        // TODO
        args: [fromBytes(twox64Concat(address as `0x${string}`), 'hex') as unknown as `0x${string}`]
      },
      {
        address: hubAddress,
        abi: hubAbi,
        functionName: 'collators',
        args: [address as `0x${string}`]
      }
    ],
    query: {
      enabled: !!address
    }
  });

  const previewInfo = useMemo(() => {
    const [commissionOfResult, poolOfResult, sessionKeyResult, collatorsResult] =
      results.data || [];

    const commissionOf = commissionOfResult?.result ?? 0n;
    const poolOf = poolOfResult?.result ?? '0x0000000000000000000000000000000000000000';
    const sessionKey =
      sessionKeyResult?.result ??
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    const collators = collatorsResult?.result ?? '0x0000000000000000000000000000000000000000';
    const isLoading = results.isLoading || results?.isRefetching || false;
    const isError = results.isError ?? false;

    const hasPool = poolOf !== undefined && poolOf !== '0x0000000000000000000000000000000000000000';
    const hasSessionKey =
      sessionKey !== undefined &&
      sessionKey !== '0x0000000000000000000000000000000000000000000000000000000000000000';
    const isRegisteredCollator = collators !== '0x0000000000000000000000000000000000000000';

    return {
      commissionOf,
      poolOf,
      sessionKey,
      collators,
      hasSessionKey,
      hasPool,
      isRegisteredCollator,
      isLoading,
      isError
    };
  }, [results]);

  return {
    ...previewInfo,
    refetch: results.refetch
  };
}

export default usePreview;
