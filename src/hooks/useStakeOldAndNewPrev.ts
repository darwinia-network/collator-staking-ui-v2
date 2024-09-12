import { DEFAULT_PREV } from '@/utils/getPrevNew';
import useAssetsToVotes, { Operation } from './useAssetsToVotes';
import { useCollatorSetNewPrev, useCollatorSetPrev } from './useService';
import useWalletStatus from './useWalletStatus';
import { genKey } from '@/utils';
import { CollatorSet } from '@/service/type';

type UseOldAndNewPrevProps = {
  inputAmount: bigint;
  collator?: CollatorSet;
  operation?: Operation;
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

  const {
    data: assetsToVotesResult,
    isLoading: isLoadingAssetsToVotes,
    isRefetching: isRefetchingAssetsToVotes
  } = useAssetsToVotes({
    commission,
    totalAmount,
    inputAmount,
    operation
  });

  const {
    data: collatorSetPrev,
    isLoading: isLoadingPrev,
    isRefetching: isRefetchingPrev
  } = useCollatorSetPrev({
    key: oldKey,
    currentChainId,
    enabled: !!oldKey && !!collatorAddress
  });

  const newKey = genKey({ address: collatorAddress, votes: assetsToVotesResult ?? 0n });

  const {
    data: collatorSetNewPrev,
    isLoading: isLoadingNewPrev,
    isRefetching: isRefetchingNewPrev
  } = useCollatorSetNewPrev({
    key: oldKey,
    newKey,
    currentChainId,
    enabled: !!collatorAddress && !!newKey && !!oldKey
  });

  const oldPrev = (
    collatorSetPrev?.[0] ? collatorSetPrev?.[0]?.address : DEFAULT_PREV
  ) as `0x${string}`;
  const newPrev = (
    collatorSetNewPrev?.[0] ? collatorSetNewPrev?.[0]?.address : DEFAULT_PREV
  ) as `0x${string}`;

  return {
    oldPrev,
    newPrev,
    isLoading:
      isLoadingAssetsToVotes ||
      isLoadingPrev ||
      isLoadingNewPrev ||
      isRefetchingAssetsToVotes ||
      isRefetchingPrev ||
      isRefetchingNewPrev
  };
}
