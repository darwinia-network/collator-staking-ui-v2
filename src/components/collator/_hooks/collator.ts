import { address as hubAddress, abi as hubAbi } from '@/config/abi/hub';
import { fetchCollatorSetPrev } from '@/hooks/useService';
import useWalletStatus from '@/hooks/useWalletStatus';
import { genKey } from '@/utils';
import { DEFAULT_PREV } from '@/utils/getPrevNew';
import { useCallback, useState } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';

type CreateAndCollatorProps = {
  commission: bigint;
};
export const useCreateAndCollator = ({ enabled }: { enabled: boolean }) => {
  const { address, isEnabled, currentChainId } = useWalletStatus();
  const { writeContractAsync, ...rest } = useWriteContract();
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const oldKey = genKey({ address: address as `0x${string}`, votes: 0n });

  const createAndCollator = useCallback(
    async ({ commission }: CreateAndCollatorProps) => {
      if (!isEnabled || !oldKey || !enabled) return;
      setIsLoadingPrev(true);
      const data = await fetchCollatorSetPrev({
        key: oldKey,
        collatorAddress: address as `0x${string}`,
        currentChainId: currentChainId!
      });
      setIsLoadingPrev(false);
      const prev = data && data?.[0] ? (data[0]?.address as `0x${string}`) : DEFAULT_PREV;
      return await writeContractAsync({
        address: hubAddress,
        abi: hubAbi,
        functionName: 'createAndCollate',
        args: [prev, commission]
      });
    },
    [writeContractAsync, isEnabled, oldKey, enabled, currentChainId, address]
  );

  return {
    createAndCollator,
    ...rest,
    isLoading: isLoadingPrev || rest.isPending
  };
};

export const useCreateCollator = ({
  commission,
  enabled
}: {
  commission: bigint;
  enabled: boolean;
}) => {
  const { address, isEnabled, currentChainId } = useWalletStatus();
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);

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

  const oldKey = genKey({ address: address as `0x${string}`, votes: (votes as bigint) ?? 0n });

  const createCollator = useCallback(
    async ({ commission }: CreateAndCollatorProps) => {
      if (!isEnabled || !oldKey || !enabled) return;
      setIsLoadingPrev(true);
      const data = await fetchCollatorSetPrev({
        key: oldKey,
        collatorAddress: address as `0x${string}`,
        currentChainId: currentChainId!
      });
      setIsLoadingPrev(false);
      const prev = data && data?.[0] ? (data[0]?.address as `0x${string}`) : DEFAULT_PREV;

      return await writeContractAsync({
        address: hubAddress,
        abi: hubAbi,
        functionName: 'collate',
        args: [prev, commission]
      });
    },
    [writeContractAsync, isEnabled, oldKey, enabled, currentChainId, address]
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
      rest.isPending
  };
};
