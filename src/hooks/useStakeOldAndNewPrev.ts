import { DEFAULT_PREV } from '@/utils/getPrevNew';
import { assetsToVotes, Operation } from './useAssetsToVotes';
import {
  fetchCollatorByAddress,
  fetchCollatorSetNewPrev,
  fetchCollatorSetPrev
} from './useService';
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
  const collatorAddress = collator?.address || '';

  const [isLoading, setIsLoading] = useState(false);

  const getPrevAndNewPrev: () => Promise<PrevResult> = useCallback(async () => {
    if (!collatorAddress) {
      return {
        oldPrev: DEFAULT_PREV,
        newPrev: DEFAULT_PREV
      };
    }
    setIsLoading(true);
    const newCollator = await fetchCollatorByAddress({
      address: collatorAddress as `0x${string}`,
      currentChainId: currentChainId!
    });
    if (!newCollator) {
      setIsLoading(false);
      return { oldPrev: DEFAULT_PREV, newPrev: DEFAULT_PREV };
    }

    const commission = BigInt(newCollator?.[0]?.commission || 0);
    const totalAmount = BigInt(newCollator?.[0]?.assets || 0);
    const oldKey = newCollator?.[0]?.key || '';

    const [assetsToVotesResult, collatorSetPrev] = await Promise.all([
      assetsToVotes(commission, totalAmount, inputAmount, operation),
      fetchCollatorSetPrev({
        key: oldKey,
        collatorAddress,
        currentChainId: currentChainId!
      })
    ]);

    const newKey = genKey({ address: collatorAddress, votes: assetsToVotesResult ?? 0n });

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
  }, [collatorAddress, currentChainId, inputAmount, operation]);

  return {
    getPrevAndNewPrev,
    isLoading
  };
}
