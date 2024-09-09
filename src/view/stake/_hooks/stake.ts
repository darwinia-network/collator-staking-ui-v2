import { useCallback } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { abi as depositAbi, address as depositAddress } from '@/config/abi/deposit';
import { useOldAndNewPrev } from '@/hooks/useOldAndNewPrev';
import { CollatorSet } from '@/service/type';
import { DepositInfo } from '@/hooks/useUserDepositDetails';
import useWalletStatus from '@/hooks/useWalletStatus';

type UseRingStakeProps = {
  collators: CollatorSet[];
  targetCollator: `0x${string}`;
  assets: bigint;
};

export const useRingStake = ({ collators, targetCollator, assets }: UseRingStakeProps) => {
  const {
    oldPrev,
    newPrev,
    isLoading: isLoadingOldAndNewPrev
  } = useOldAndNewPrev({
    collatorList: collators,
    collator: targetCollator,
    inputAmount: assets,
    operation: 'add'
  });

  const result = useWriteContract();

  const handleStake = useCallback(async () => {
    if (!targetCollator || !oldPrev || !newPrev || !assets) return;

    return result.writeContractAsync({
      address,
      abi,
      functionName: 'stakeRING',
      args: [targetCollator, oldPrev, newPrev],
      value: assets
    });
  }, [result, targetCollator, oldPrev, newPrev, assets]);

  return { ...result, handleStake, isLoadingOldAndNewPrev };
};

type UseDepositStakeProps = {
  collators: CollatorSet[];
  targetCollator: `0x${string}`;
  deposits: DepositInfo[];
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

export const useDepositStake = ({ collators, targetCollator, deposits }: UseDepositStakeProps) => {
  const assets = deposits.reduce((acc, deposit) => acc + deposit.value, 0n);
  const {
    oldPrev,
    newPrev,
    isLoading: isLoadingOldAndNewPrev
  } = useOldAndNewPrev({
    collatorList: collators,
    collator: targetCollator,
    inputAmount: assets,
    operation: 'add'
  });

  const result = useWriteContract();

  const handleStake = useCallback(async () => {
    if (!targetCollator || !oldPrev || !newPrev || !assets) return;

    return result.writeContractAsync({
      address,
      abi,
      functionName: 'stakeDeposits',
      args: [targetCollator, deposits.map((deposit) => BigInt(deposit.tokenId)), oldPrev, newPrev]
    });
  }, [result, targetCollator, oldPrev, newPrev, assets, deposits]);

  return { ...result, handleStake, isLoadingOldAndNewPrev };
};
