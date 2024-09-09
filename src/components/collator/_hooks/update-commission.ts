import { abi as hubAbi, address as hubAddress } from '@/config/abi/hub';
import { useReadContract, useWriteContract } from 'wagmi';
import { isNil } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { determineOldAndNewPrev } from '@/utils/getPrevNew';
import type { CollatorSet } from '@/service/type';

type UpdateCommissionProps = {
  collatorList: CollatorSet[];
  collator: `0x${string}`;
  newCommission: bigint;
};

const useUpdateCommission = ({ collatorList, collator, newCommission }: UpdateCommissionProps) => {
  const totalAssets = useMemo(() => {
    const assets = collatorList.find((c) => c.address === collator)?.assets;
    return assets ? BigInt(assets) : BigInt(0);
  }, [collatorList, collator]);

  const { data: votes, isLoading: isLoadingVotes } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'assetsToVotes',
    args: [totalAssets, newCommission],
    query: {
      enabled: !!newCommission && !isNil(totalAssets)
    }
  });

  const { oldPrev, newPrev } = determineOldAndNewPrev({
    collatorList,
    collator,
    newVotes: votes || BigInt(0)
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const updateCommission = useCallback(async () => {
    return writeContractAsync({
      abi: hubAbi,
      address: hubAddress,
      functionName: 'updateCommission',
      args: [newCommission, oldPrev, newPrev]
    });
  }, [newCommission, oldPrev, newPrev, writeContractAsync]);

  return { updateCommission, isPending, votes, isLoadingVotes };
};

export default useUpdateCommission;
