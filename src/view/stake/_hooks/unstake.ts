import { useWriteContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { useCallback } from 'react';
import { useOldAndNewPrev } from '@/hooks/useOldAndNewPrev';
import type { CollatorSet } from '@/service/type';
import { StakedDepositInfo } from './staked';
import { sumBy } from 'lodash-es';
type UnstakeRINGParams = {
  collatorList: CollatorSet[];
  collator: `0x${string}`;
  inputAmount: bigint;
};
export const useUnstakeRING = ({ collatorList, collator, inputAmount }: UnstakeRINGParams) => {
  const { writeContractAsync, ...rest } = useWriteContract();
  const {
    oldPrev,
    newPrev,
    isLoading: isLoadingOldAndNewPrev
  } = useOldAndNewPrev({
    collatorList,
    collator,
    inputAmount,
    operation: 'subtract'
  });

  const unstakeRING = useCallback(async () => {
    return writeContractAsync({
      address: address,
      abi: abi,
      functionName: 'unstakeRING',
      args: [collator, inputAmount, oldPrev, newPrev]
    });
  }, [writeContractAsync, collator, inputAmount, oldPrev, newPrev]);

  return { unstakeRING, ...rest, isLoadingOldAndNewPrev };
};

type UnstakeDepositsParams = {
  collatorList: CollatorSet[];
  collator: `0x${string}`;
  deposits: StakedDepositInfo[];
};

export const useUnstakeDeposits = ({ collatorList, collator, deposits }: UnstakeDepositsParams) => {
  const { writeContractAsync, ...rest } = useWriteContract();
  const {
    oldPrev,
    newPrev,
    isLoading: isLoadingOldAndNewPrev
  } = useOldAndNewPrev({
    collatorList,
    collator,
    inputAmount: sumBy(deposits, 'amount'),
    operation: 'subtract'
  });

  const unstakeDeposits = useCallback(async () => {
    return writeContractAsync({
      address: address,
      abi: abi,
      functionName: 'unstakeDeposits',
      args: [collator, deposits.map((deposit) => deposit.tokenId), oldPrev, newPrev]
    });
  }, [writeContractAsync, collator, deposits, oldPrev, newPrev]);

  return { unstakeDeposits, ...rest, isLoadingOldAndNewPrev };
};
