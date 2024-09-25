import { DEFAULT_PREV } from '@/utils/getPrevNew';
import useAssetsToVotes, { Operation } from './useAssetsToVotes';
import { useCollatorSetNewPrev, useCollatorSetPrev } from './useService';
import { genKey } from '@/utils';
import { CollatorSet } from '@/service/type';
import { useCallback, useState } from 'react';

type UseOldAndNewPrevProps = {
  inputAmount: bigint;
  collator?: CollatorSet;
  operation?: Operation;
};
type PrevResult = {
  oldPrev: `0x${string}`;
  newPrev: `0x${string}`;
};

export function useStakeOldAndNewPrev({
  collator,
  inputAmount,
  operation = 'add'
}: UseOldAndNewPrevProps) {
  const [newKey, setNewKey] = useState<`0x${string}` | undefined>();
  const commission = BigInt(collator?.commission || 0);
  const totalAmount = BigInt(collator?.assets || 0);
  const collatorAddress = collator?.address || '';
  const oldKey = collator?.key || '';

  const {
    isLoading: isLoadingAssetsToVotes,
    isRefetching: isRefetchingAssetsToVotes,
    refetch: refetchAssetsToVotes
  } = useAssetsToVotes({
    commission,
    totalAmount,
    inputAmount,
    operation
  });

  const {
    isLoading: isLoadingPrev,
    isRefetching: isRefetchingPrev,
    refetch: refetchPrev
  } = useCollatorSetPrev({
    key: oldKey,
    enabled: false
  });

  const {
    isLoading: isLoadingNewPrev,
    isRefetching: isRefetchingNewPrev,
    refetch: refetchNewPrev
  } = useCollatorSetNewPrev({
    key: oldKey,
    newKey,
    enabled: false
  });

  const getPrevAndNewPrev: () => Promise<PrevResult> = useCallback(async () => {
    if (!oldKey || !collatorAddress)
      return {
        oldPrev: DEFAULT_PREV,
        newPrev: DEFAULT_PREV
      };
    const [assetsToVotesResult, collatorSetPrev] = await Promise.all([
      refetchAssetsToVotes(),
      refetchPrev()
    ]);

    const newKey = genKey({ address: collatorAddress, votes: assetsToVotesResult?.data ?? 0n });
    setNewKey(newKey as `0x${string}`);
    if (!newKey) return { oldPrev: DEFAULT_PREV, newPrev: DEFAULT_PREV };
    const collatorSetNewPrev = await refetchNewPrev();

    return {
      oldPrev: collatorSetPrev?.[0]?.address
        ? (collatorSetPrev?.[0]?.address as `0x${string}`)
        : DEFAULT_PREV,
      newPrev: collatorSetNewPrev?.[0]?.address
        ? (collatorSetNewPrev?.[0]?.address as `0x${string}`)
        : DEFAULT_PREV
    };
  }, [collatorAddress, oldKey, refetchAssetsToVotes, refetchNewPrev, refetchPrev]);

  return {
    getPrevAndNewPrev,
    isLoading:
      isLoadingAssetsToVotes ||
      isLoadingPrev ||
      isLoadingNewPrev ||
      isRefetchingAssetsToVotes ||
      isRefetchingPrev ||
      isRefetchingNewPrev
  };
}
