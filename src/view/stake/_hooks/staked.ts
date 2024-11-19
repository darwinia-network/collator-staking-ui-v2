import { address, abi as hubAbi } from '@/config/abi/hub';
import { address as depositAddress, abi as depositAbi } from '@/config/abi/deposit';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useCallback, useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import dayjs from 'dayjs';
import { Abi } from 'viem';

export type StakedDepositsInfo = [account: `0x${string}`, assets: bigint, collator: `0x${string}`];
export type StakedDepositInfo = {
  tokenId: bigint;
  amount: bigint;
  collator: `0x${string}`;
  startAt: number;
  endAt: number;
};

type StakedDepositsOfProps = {
  account?: `0x${string}`;
  enabled?: boolean;
};
export const useStakedDepositsOf = ({ account, enabled = true }: StakedDepositsOfProps) => {
  const {
    data: stakedDepositsOf,
    isLoading: isStakedDepositsOfLoading,
    isRefetching: isStakedDepositsOfRefetching,
    refetch: refetchStakedDepositsOf
  } = useReadContract<typeof hubAbi, 'stakedDepositsOf', bigint[]>({
    address,
    abi: hubAbi,
    functionName: 'stakedDepositsOf',
    args: [account as `0x${string}`],
    query: {
      enabled: !!account && enabled,
      refetchOnMount: true,
      staleTime: 0
    }
  });

  const {
    data: combinedInfo,
    isLoading: isCombinedInfoLoading,
    isRefetching: isCombinedInfoRefetching,
    refetch: refetchCombinedInfo
  } = useReadContracts({
    contracts:
      ((stakedDepositsOf as bigint[])?.flatMap((deposit) => [
        {
          address: address as `0x${string}`,
          abi: hubAbi,
          functionName: 'depositInfos',
          args: [deposit]
        },
        {
          address: depositAddress as `0x${string}`,
          abi: depositAbi,
          functionName: 'depositOf',
          args: [deposit]
        }
      ]) as unknown as readonly {
        abi?: Abi | undefined;
        functionName?: string | undefined;
        args?: readonly unknown[] | undefined;
        address?: `0x${string}` | undefined;
        chainId?: number | undefined;
      }[]) ?? [],
    query: {
      enabled: !!account && !!(stakedDepositsOf as bigint[])?.length,
      retry: true,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  });

  const refetch = useCallback(() => {
    refetchStakedDepositsOf();
    refetchCombinedInfo();
  }, [refetchStakedDepositsOf, refetchCombinedInfo]);

  const processedData = useMemo(() => {
    if (!combinedInfo) return [];
    return (
      (stakedDepositsOf as bigint[])?.map((tokenId, index) => {
        const depositInfo = combinedInfo[index * 2]?.result as unknown as StakedDepositsInfo;
        const depositOf = combinedInfo[index * 2 + 1]?.result;

        const months = depositOf?.[0] ?? 0n;
        const startAt = Number(depositOf?.[1] ?? 0);
        // const endAt = dayjs
        //   .unix(Number(startAt))
        //   .add(dayjs.duration({ months: Number(months) }))
        //   .unix();

        const endAt = dayjs
          .unix(Number(startAt))
          .add(Number(months) * 30, 'day')
          .unix();

        return {
          tokenId: tokenId,
          amount: depositInfo?.[1] ?? 0n,
          collator: depositInfo?.[2] as `0x${string}`,
          startAt: startAt,
          endAt: endAt
        };
      }) ?? []
    );
  }, [combinedInfo, stakedDepositsOf]);

  return {
    data: processedData as StakedDepositInfo[],
    isLoading:
      isStakedDepositsOfLoading ||
      isCombinedInfoLoading ||
      isStakedDepositsOfRefetching ||
      isCombinedInfoRefetching,
    refetch
  };
};

type StakedProps = {
  collatorAddress: `0x${string}`;
  enabled?: boolean;
};
export const useStaked = ({ collatorAddress, enabled = true }: StakedProps) => {
  const { address: account } = useWalletStatus();

  const {
    data: stakedDeposits,
    isLoading: isStakedDepositsLoading,
    refetch: refetchStakedDeposits
  } = useStakedDepositsOf({
    account,
    enabled
  });

  const filteredStakedDeposits = useMemo(() => {
    return (
      stakedDeposits?.filter((deposit) => {
        return deposit?.collator?.toLowerCase() === collatorAddress?.toLowerCase();
      }) ?? []
    );
  }, [stakedDeposits, collatorAddress]);

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchStaked
  } = useReadContracts({
    contracts: [
      {
        address,
        abi: hubAbi,
        functionName: 'stakedRINGOf',
        args: [collatorAddress, account as `0x${string}`]
      },
      {
        address,
        abi: hubAbi,
        functionName: 'stakingLocks',
        args: [collatorAddress, account as `0x${string}`]
      }
    ],
    query: {
      enabled: !!account && !!collatorAddress && enabled
    }
  });
  const refetch = useCallback(() => {
    refetchStakedDeposits();
    refetchStaked();
  }, [refetchStakedDeposits, refetchStaked]);

  return {
    stakedRING: data?.[0]?.result as bigint,
    stakingLocks: data?.[1]?.result as bigint,
    stakedDeposits: filteredStakedDeposits,
    isLoading: isStakedDepositsLoading || isLoading || isRefetching,
    refetch
  };
};
