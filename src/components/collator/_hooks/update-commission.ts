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
  oldPrev: `0x${string}`;
  collatorAddress: `0x${string}`;
  totalAssets: bigint;
};

const useUpdateCommission = ({
  newCommission,
  oldKey,
  oldPrev,
  collatorAddress,
  totalAssets
}: UpdateCommissionProps) => {
  const { data: votes, isLoading: isLoadingVotes } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'assetsToVotes',
    args: [totalAssets, newCommission],
    query: {
      enabled: !!newCommission && !isNil(totalAssets)
    }
  });

  const newKey = genKey({ address: collatorAddress, votes: votes ?? 0n });

  const {
    data: collatorSetNewPrev,
    isLoading: isLoadingNewPrev,
    isRefetching: isRefetchingNewPrev
  } = useCollatorSetNewPrev({
    key: newKey,
    newKey,
    enabled: !!collatorAddress && !!newKey && !!oldKey
  });

  const newPrev = (
    collatorSetNewPrev?.[0] ? collatorSetNewPrev?.[0]?.address : DEFAULT_PREV
  ) as `0x${string}`;

  const { writeContractAsync, isPending } = useWriteContract();

  const updateCommission = useCallback(async () => {
    return writeContractAsync({
      abi: hubAbi,
      address: hubAddress,
      functionName: 'updateCommission',
      args: [newCommission, oldPrev, newPrev]
    });
  }, [newCommission, oldPrev, newPrev, writeContractAsync]);

  return {
    updateCommission,
    isPending,
    votes,
    isLoading: isLoadingVotes || isLoadingNewPrev || isRefetchingNewPrev
  };
};

export default useUpdateCommission;
