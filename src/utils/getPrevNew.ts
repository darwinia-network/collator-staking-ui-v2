import type { CollatorSet } from '@/service/type';

export const DEFAULT_PREV = '0x0000000000000000000000000000000000000001';

type DetermineOldAndNewPrevProps = {
  collatorList: CollatorSet[];
  collator: string;
  newVotes: bigint;
};
export function determineOldAndNewPrev({
  collatorList,
  collator,
  newVotes
}: DetermineOldAndNewPrevProps) {
  let oldPrev = DEFAULT_PREV as `0x${string}`;
  let newPrev = DEFAULT_PREV as `0x${string}`;

  const target = collatorList.find((c) => c.address === collator);

  if (!target) {
    console.error('Target collator not found');
    return { oldPrev, newPrev };
  }

  const currentIndex = collatorList.findIndex((c) => c.address === collator);
  if (currentIndex > 0) {
    oldPrev = collatorList[currentIndex - 1].address as `0x${string}`;
  }

  const sortedCollators = [...collatorList].sort((a, b) => {
    const votesA = a.address === collator ? newVotes : BigInt(a.votes || '0');
    const votesB = b.address === collator ? newVotes : BigInt(b.votes || '0');
    return votesB > votesA ? 1 : votesB < votesA ? -1 : 0;
  });

  const newIndex = sortedCollators.findIndex((c) => c.address === collator);
  if (newIndex > 0) {
    newPrev = sortedCollators[newIndex - 1].address as `0x${string}`;
  }

  return { oldPrev, newPrev };
}
