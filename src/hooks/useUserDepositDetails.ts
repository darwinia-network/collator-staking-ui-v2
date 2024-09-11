import { address as depositAddress, abi as depositAbi } from '@/config/abi/deposit';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useReadContract, useReadContracts } from 'wagmi';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { sortBy } from 'lodash-es';
import dayjs from '@/utils/date';

export type DepositInfo = {
  tokenId: bigint;
  months: number;
  value: bigint;
  startAt: number;
  endAt: number;
  isClaimRequirePenalty: boolean;
};

type UseUserDepositDetailsProps = {
  enabled?: boolean;
};

export function useUserDepositDetails({ enabled = true }: UseUserDepositDetailsProps) {
  const { address: account } = useWalletStatus();
  const [depositList, setDepositList] = useState<DepositInfo[]>([]);

  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
    isRefetching: isBalanceRefetching
  } = useReadContract({
    address: depositAddress,
    abi: depositAbi,
    functionName: 'balanceOf',
    args: [account as `0x${string}`],
    query: {
      enabled: !!account && enabled,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 0
    }
  });

  const balanceNumber = balance ? Number(balance) : 0;

  const {
    data: tokenIdsResult,
    isLoading: isTokenIdsLoading,
    isRefetching: isTokenIdsRefetching
  } = useReadContracts({
    contracts: Array.from({ length: balanceNumber }, (_, index) => ({
      address: depositAddress as `0x${string}`,
      abi: depositAbi,
      functionName: 'tokenOfOwnerByIndex',
      args: [account as `0x${string}`, BigInt(index)]
    })),
    query: {
      enabled: balanceNumber > 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 0
    }
  });

  const validTokenIds = useMemo(
    () =>
      tokenIdsResult
        ?.filter(
          (result): result is { status: 'success'; result: bigint } =>
            result.status === 'success' && result.result !== undefined
        )
        .map((result) => result.result) ?? [],
    [tokenIdsResult]
  );

  const {
    data: combinedInfos,
    isLoading: isCombinedInfosLoading,
    isRefetching: isCombinedInfosRefetching
  } = useReadContracts({
    contracts: validTokenIds
      .map((tokenId) => [
        {
          address: depositAddress as `0x${string}`,
          abi: depositAbi,
          functionName: 'depositOf',
          args: [tokenId]
        },
        {
          address: depositAddress as `0x${string}`,
          abi: depositAbi,
          functionName: 'isClaimRequirePenalty',
          args: [tokenId]
        }
      ])
      .flat(),
    query: {
      enabled: validTokenIds.length > 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 0
    }
  });

  const deleteDepositInfoByTokenId = useCallback((tokenId: bigint) => {
    setDepositList((prevDepositList) =>
      prevDepositList.filter((deposit) => deposit.tokenId !== tokenId)
    );
  }, []);
  const isLoading = useMemo(() => {
    return (
      isBalanceLoading ||
      isTokenIdsLoading ||
      isCombinedInfosLoading ||
      isBalanceRefetching ||
      isTokenIdsRefetching ||
      isCombinedInfosRefetching
    );
  }, [
    isBalanceLoading,
    isTokenIdsLoading,
    isCombinedInfosLoading,
    isBalanceRefetching,
    isTokenIdsRefetching,
    isCombinedInfosRefetching
  ]);
  useEffect(() => {
    if (isLoading) return;

    if (validTokenIds && combinedInfos) {
      const newDepositList = validTokenIds.map((tokenId, index) => {
        const depositInfo = combinedInfos?.[index * 2]?.result || [];
        const isClaimRequirePenalty = !!combinedInfos?.[index * 2 + 1]?.result || true;

        const months = depositInfo?.[0] ?? 0;
        const startAt = Number(depositInfo?.[1] ?? 0);
        const value = depositInfo?.[2] ?? 0;

        const endAt = dayjs
          .unix(startAt)
          .add(dayjs.duration({ months: Number(months) }))
          .unix();

        return {
          tokenId,
          months,
          value,
          startAt,
          endAt,
          isClaimRequirePenalty
        };
      });
      const sortedDepositList = sortBy(newDepositList, 'tokenId');

      setDepositList(sortedDepositList);
    } else {
      setDepositList([]);
    }
  }, [validTokenIds, combinedInfos, setDepositList, isLoading]);

  const refetch = useCallback(async () => {
    refetchBalance();
  }, [refetchBalance]);

  return {
    depositList,
    deleteDepositInfoByTokenId,
    isLoading,
    refetch
  };
}
