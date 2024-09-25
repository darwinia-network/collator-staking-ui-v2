import { abi as hubAbi, address as hubAddress } from '@/config/abi/hub';
import { useReadContract, useWriteContract } from 'wagmi';
import { isNil } from 'lodash-es';
import { useCallback } from 'react';
import { DEFAULT_PREV } from '@/utils/getPrevNew';
import { useCollatorSetNewPrev } from '@/hooks/useService';
import { genKey } from '@/utils';

type UpdateCommissionProps = {
  newCommission: bigint;
  oldKey: string;
  collatorAddress: `0x${string}`;
  totalAssets: bigint;
};

const useUpdateCommission = ({
  newCommission,
  oldKey,
  collatorAddress,
  totalAssets
}: UpdateCommissionProps) => {
  const { data: votes, isLoading: isLoadingVotes } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'assetsToVotes',
    args: [totalAssets, newCommission],
    query: {
      enabled: !isNil(totalAssets)
    }
  });

  const newKey = genKey({ address: collatorAddress, votes: votes ?? 0n });

  const {
    isLoading: isLoadingNewPrev,
    isRefetching: isRefetchingNewPrev,
    refetch: refetchNewPrev
  } = useCollatorSetNewPrev({
    key: newKey,
    newKey,
    enabled: !!collatorAddress && !!newKey && !!oldKey
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const updateCommission = useCallback(
    async ({ oldPrev }) => {
      if (!collatorAddress || !newKey || !oldKey) {
        return;
      }
      const { data } = await refetchNewPrev();
      const newPrev =
        data && data?.[0]?.address ? (data?.[0]?.address as `0x${string}`) : DEFAULT_PREV;

      return writeContractAsync({
        abi: hubAbi,
        address: hubAddress,
        functionName: 'updateCommission',
        args: [newCommission, oldPrev, newPrev]
      });
    },
    [newCommission, writeContractAsync, refetchNewPrev, collatorAddress, newKey, oldKey]
  );

  return {
    updateCommission,
    isPending,
    votes,
    isLoading: isLoadingVotes || isLoadingNewPrev || isRefetchingNewPrev
  };
};

export default useUpdateCommission;
