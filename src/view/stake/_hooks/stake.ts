import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { useStakeOldAndNewPrev } from '@/hooks/useStakeOldAndNewPrev';
import { CollatorSet } from '@/service/type';

type UseRingStakeProps = {
  collator?: CollatorSet;
  assets: bigint;
};

export const useRingStake = ({ collator, assets }: UseRingStakeProps) => {
  const collatorAddress = collator?.address as `0x${string}`;
  const { getPrevAndNewPrev, isLoading: isLoadingOldAndNewPrev } = useStakeOldAndNewPrev({
    collator,
    inputAmount: assets
  });

  const result = useWriteContract();

  const handleStake = useCallback(async () => {
    const { oldPrev, newPrev } = (await getPrevAndNewPrev()) || {};
    if (!collatorAddress || !oldPrev || !newPrev || !assets) return;

    console.log('%cCalling stakeRING function', 'color: #4CAF50; font-weight: bold;');
    console.log('%cAddress:', 'color: #2196F3;', collatorAddress);
    console.log('%coldPrev:', 'color: #FFC107;', oldPrev);
    console.log('%cnewPrev:', 'color: #FF5722;', newPrev);
    console.log('%cAssets:', 'color: #9C27B0;', assets.toString());
    return result.writeContractAsync({
      address,
      abi,
      functionName: 'stakeRING',
      args: [collatorAddress, oldPrev, newPrev],
      value: assets
    });
  }, [result, collatorAddress, assets, getPrevAndNewPrev]);

  return { ...result, handleStake, isLoadingOldAndNewPrev };
};
