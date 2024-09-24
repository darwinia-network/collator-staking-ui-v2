import { address as hubAddress, abi as hubAbi } from '@/config/abi/hub';
import { useCollatorSetPrev } from '@/hooks/useService';
import useWalletStatus from '@/hooks/useWalletStatus';
import { genKey } from '@/utils';
import { DEFAULT_PREV } from '@/utils/getPrevNew';
import { useCallback } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';

type CreateAndCollatorProps = {
  commission: bigint;
};
export const useCreateAndCollator = ({ enabled }: { enabled: boolean }) => {
  const { address, isEnabled } = useWalletStatus();
  const { writeContractAsync, ...rest } = useWriteContract();
  const oldKey = genKey({ address: address as `0x${string}`, votes: 0n });
  const {
    data: collatorSetPrev,
    isLoading: isLoadingPrev,
    isRefetching: isRefetchingPrev
  } = useCollatorSetPrev({
    key: oldKey,
    enabled: isEnabled && !!oldKey && enabled
  });

  const prev = (
    collatorSetPrev?.[0] ? collatorSetPrev?.[0]?.address : DEFAULT_PREV
  ) as `0x${string}`;

  const createAndCollator = useCallback(
    async ({ commission }: CreateAndCollatorProps) => {
      return await writeContractAsync({
        address: hubAddress,
        abi: hubAbi,
        functionName: 'createAndCollate',
        args: [prev, commission]
      });
    },
    [writeContractAsync, prev]
  );

  return {
    createAndCollator,
    ...rest,
    isLoading: isLoadingPrev || isRefetchingPrev || rest.isPending
  };
};

export const useCreateCollator = ({
  commission,
  enabled
}: {
  commission: bigint;
  enabled: boolean;
}) => {
  const { address, isEnabled } = useWalletStatus();
  const {
    data: stakedOf,
    isLoading: isLoadingStakedOf,
    isRefetching: isRefetchingStakedOf
  } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'stakedOf',
    args: [address as `0x${string}`],
    query: {
      enabled: isEnabled && enabled
    }
  });

  const {
    data: votes,
    isLoading: isLoadingVotes,
    isRefetching: isRefetchingVotes
  } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'assetsToVotes',
    args: [stakedOf ?? 0n, commission],
    query: {
      enabled: isEnabled && !!stakedOf && enabled
    }
  });

  const { writeContractAsync, ...rest } = useWriteContract();

  const oldKey = genKey({ address: address as `0x${string}`, votes: votes ?? 0n });

  const {
    data: collatorSetPrev,
    isLoading: isLoadingPrev,
    isRefetching: isRefetchingPrev
  } = useCollatorSetPrev({
    key: oldKey,
    enabled: isEnabled && !!oldKey && enabled
  });

  const prev = (
    collatorSetPrev?.[0] ? collatorSetPrev?.[0]?.address : DEFAULT_PREV
  ) as `0x${string}`;

  const createCollator = useCallback(
    async ({ commission }: CreateAndCollatorProps) => {
      return await writeContractAsync({
        address: hubAddress,
        abi: hubAbi,
        functionName: 'collate',
        args: [prev, commission]
      });
    },
    [writeContractAsync, prev]
  );

  return {
    createCollator,
    ...rest,
    isLoading:
      isLoadingStakedOf ||
      isRefetchingStakedOf ||
      isLoadingVotes ||
      isRefetchingVotes ||
      isLoadingPrev ||
      isRefetchingPrev ||
      rest.isPending
  };
};
