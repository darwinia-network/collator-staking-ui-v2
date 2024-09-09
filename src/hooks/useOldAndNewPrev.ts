import { determineOldAndNewPrev, DEFAULT_PREV } from '@/utils/getPrevNew';
import useAssetsToVotes from './useAssetsToVotes';
import type { CollatorSet } from '@/service/type';
import type { Operation } from './useAssetsToVotes';

type UseOldAndNewPrevProps = {
  collatorList: CollatorSet[];
  collator: `0x${string}`;
  inputAmount: bigint;
  operation: Operation;
};

const defaultResult = {
  oldPrev: DEFAULT_PREV as `0x${string}`,
  newPrev: DEFAULT_PREV as `0x${string}`,
  isLoading: false
};
export function useOldAndNewPrev({
  collatorList = [],
  collator,
  inputAmount,
  operation
}: UseOldAndNewPrevProps) {
  const collatorInfo = collatorList?.find((c) => c.address === collator);
  const totalAmount = BigInt(collatorInfo?.assets || 0);
  const commission = BigInt(collatorInfo?.commission || 0);

  const assetsToVotesResult = useAssetsToVotes({
    commission,
    totalAmount,
    inputAmount,
    operation
  });

  if (!collatorList || collatorList.length === 0) {
    return defaultResult;
  }

  if (!collatorInfo) {
    return defaultResult;
  }

  if (assetsToVotesResult.isLoading) {
    return { ...defaultResult, isLoading: true };
  }

  if (assetsToVotesResult.error) {
    return { ...defaultResult, isLoading: false };
  }

  const { oldPrev, newPrev } = determineOldAndNewPrev({
    collatorList,
    collator,
    newVotes: assetsToVotesResult.data || 0n
  });

  return { oldPrev, newPrev, isLoading: false };
}
