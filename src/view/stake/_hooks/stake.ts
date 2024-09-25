import { useCallback } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { abi as depositAbi, address as depositAddress } from '@/config/abi/deposit';
import { useStakeOldAndNewPrev } from '@/hooks/useStakeOldAndNewPrev';
import { CollatorSet } from '@/service/type';
import { DepositInfo } from '@/hooks/useUserDepositDetails';
import useWalletStatus from '@/hooks/useWalletStatus';

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

export const useIsApprovedForAll = () => {
  const { address: operator } = useWalletStatus();
  const result = useReadContract({
    address: depositAddress,
    abi: depositAbi,
    functionName: 'isApprovedForAll',
    args: [operator!, address],
    query: {
      enabled: !!operator
    }
  });
  return result;
};

export const useApprovalForAll = () => {
  const result = useWriteContract();
  const handleApprovalForAll = useCallback(async () => {
    return result.writeContractAsync({
      address: depositAddress,
      abi: depositAbi,
      functionName: 'setApprovalForAll',
      args: [address, true]
    });
  }, [result]);

  return { ...result, handleApprovalForAll };
};

type UseDepositStakeProps = {
  collator?: CollatorSet;
  deposits: DepositInfo[];
};

export const useDepositStake = ({ collator, deposits }: UseDepositStakeProps) => {
  const collatorAddress = collator?.address as `0x${string}`;
  const assets = deposits.reduce((acc, deposit) => acc + deposit.value, 0n);

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
      functionName: 'stakeDeposits',
      args: [collatorAddress, deposits.map((deposit) => BigInt(deposit.tokenId)), oldPrev, newPrev]
    });
  }, [result, collatorAddress, assets, deposits, getPrevAndNewPrev]);

  return { ...result, handleStake, isLoadingOldAndNewPrev };
};
