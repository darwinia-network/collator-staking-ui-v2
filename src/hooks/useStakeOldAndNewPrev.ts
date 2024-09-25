import { DEFAULT_PREV } from '@/utils/getPrevNew';
import useAssetsToVotes, { Operation } from './useAssetsToVotes';
import { fetchCollatorSetNewPrev, fetchCollatorSetPrev } from './useService';
import { genKey } from '@/utils';
import { CollatorSet } from '@/service/type';
import { useCallback, useState } from 'react';
import useWalletStatus from './useWalletStatus';

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
  const { currentChainId } = useWalletStatus();
  const commission = BigInt(collator?.commission || 0);
  const totalAmount = BigInt(collator?.assets || 0);
  const collatorAddress = collator?.address || '';
  const oldKey = collator?.key || '';

  const [isLoading, setIsLoading] = useState(false);
  const { refetch: refetchAssetsToVotes, data } = useAssetsToVotes({
    commission,
    totalAmount,
    inputAmount,
    operation
  });

  console.log('data', data);

  const getPrevAndNewPrev: () => Promise<PrevResult> = useCallback(async () => {
    setIsLoading(true);

    if (!oldKey || !collatorAddress) {
      setIsLoading(true);
      return {
        oldPrev: DEFAULT_PREV,
        newPrev: DEFAULT_PREV
      };
    }

    const [assetsToVotesResult, collatorSetPrev] = await Promise.all([
      refetchAssetsToVotes(),
      fetchCollatorSetPrev({ key: oldKey, currentChainId: currentChainId! })
    ]);
    console.log('assetsToVotesResult?.data ', assetsToVotesResult?.data);

    const newKey = genKey({ address: collatorAddress, votes: assetsToVotesResult?.data ?? 0n });

    console.log('newKey', newKey);

    if (!newKey) {
      setIsLoading(false);
      return { oldPrev: DEFAULT_PREV, newPrev: DEFAULT_PREV };
    }
    const collatorSetNewPrev = await fetchCollatorSetNewPrev({
      collatorAddress,
      newKey,
      currentChainId: currentChainId!
    });

    setIsLoading(false);

    return {
      oldPrev: collatorSetPrev?.[0]?.address
        ? (collatorSetPrev?.[0]?.address as `0x${string}`)
        : DEFAULT_PREV,
      newPrev: collatorSetNewPrev?.[0]?.address
        ? (collatorSetNewPrev?.[0]?.address as `0x${string}`)
        : DEFAULT_PREV
    };
  }, [refetchAssetsToVotes, collatorAddress, oldKey, currentChainId]);

  return {
    getPrevAndNewPrev,
    isLoading
  };
}
