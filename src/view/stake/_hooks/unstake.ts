import { useWriteContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { useCallback } from 'react';
import { useStakeOldAndNewPrev } from '@/hooks/useStakeOldAndNewPrev';
import type { CollatorSet } from '@/service/type';
import { StakedDepositInfo } from './staked';
import { sumBy } from 'lodash-es';
type UnstakeRINGParams = {
  collator?: CollatorSet;
  inputAmount: bigint;
};
export const useUnstakeRING = ({ collator, inputAmount }: UnstakeRINGParams) => {
  const { writeContractAsync, ...rest } = useWriteContract();
  const collatorAddress = collator?.address as `0x${string}`;
  const { getPrevAndNewPrev, isLoading: isLoadingOldAndNewPrev } = useStakeOldAndNewPrev({
    collator,
    inputAmount,
    operation: 'subtract'
  });

  const unstakeRING = useCallback(async () => {
    const { oldPrev, newPrev } = await getPrevAndNewPrev();
    if (!oldPrev || !newPrev) return;
    return writeContractAsync({
      address: address,
      abi: abi,
      functionName: 'unstakeRING',
      args: [collatorAddress, inputAmount, oldPrev, newPrev]
    });
  }, [writeContractAsync, collatorAddress, inputAmount, getPrevAndNewPrev]);

  return { unstakeRING, ...rest, isLoadingOldAndNewPrev };
};

export const useUnstakeRINGFromInactiveCollator = ({
  collator,
  inputAmount
}: UnstakeRINGParams) => {
  const { writeContractAsync, ...rest } = useWriteContract();
  const collatorAddress = collator?.address as `0x${string}`;

  const unstakeRINGFromInactiveCollator = useCallback(async () => {
    return writeContractAsync({
      address: address,
      abi: abi,
      functionName: 'unstakeRINGFromInactiveCollator',
      args: [collatorAddress, inputAmount]
    });
  }, [writeContractAsync, collatorAddress, inputAmount]);

  return { unstakeRINGFromInactiveCollator, ...rest };
};

type UnstakeDepositsParams = {
  collator?: CollatorSet;
  deposits: StakedDepositInfo[];
};

export const useUnstakeDeposits = ({ collator, deposits }: UnstakeDepositsParams) => {
  const { writeContractAsync, ...rest } = useWriteContract();
  const collatorAddress = collator?.address as `0x${string}`;

  const { getPrevAndNewPrev, isLoading: isLoadingOldAndNewPrev } = useStakeOldAndNewPrev({
    collator,
    inputAmount: sumBy(deposits, 'amount'),
    operation: 'subtract'
  });

  const unstakeDeposits = useCallback(async () => {
    const { oldPrev, newPrev } = await getPrevAndNewPrev();
    if (!oldPrev || !newPrev) return;
    return writeContractAsync({
      address: address,
      abi: abi,
      functionName: 'unstakeDeposits',
      args: [collatorAddress, deposits.map((deposit) => deposit.tokenId), oldPrev, newPrev]
    });
  }, [writeContractAsync, collatorAddress, deposits, getPrevAndNewPrev]);

  return { unstakeDeposits, ...rest, isLoadingOldAndNewPrev };
};

export const useUnstakeDepositsFromInactiveCollator = ({
  collator,
  deposits
}: UnstakeDepositsParams) => {
  const { writeContractAsync, ...rest } = useWriteContract();
  const collatorAddress = collator?.address as `0x${string}`;

  const unstakeDepositsFromInactiveCollator = useCallback(async () => {
    return writeContractAsync({
      address: address,
      abi: abi,
      functionName: 'unstakeDepositsFromInactiveCollator',
      args: [collatorAddress, deposits.map((deposit) => deposit.tokenId)]
    });
  }, [writeContractAsync, collatorAddress, deposits]);

  return { unstakeDepositsFromInactiveCollator, ...rest };
};
