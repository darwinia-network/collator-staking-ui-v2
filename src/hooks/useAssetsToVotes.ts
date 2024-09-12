import { useReadContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { isNil } from 'lodash-es';

export type Operation = 'add' | 'subtract';

interface AssetsToVotesProps {
  commission: bigint;
  totalAmount: bigint;
  inputAmount: bigint;
  operation: Operation;
}

function useAssetsToVotes({ commission, totalAmount, inputAmount, operation }: AssetsToVotesProps) {
  const result = useReadContract({
    abi,
    address,
    functionName: 'assetsToVotes',
    args: [commission, calculateAssets(totalAmount, inputAmount, operation)],
    query: {
      enabled: !isNil(totalAmount) && !isNil(inputAmount) && !!commission,
      staleTime: 0
    }
  });

  return result;
}

function calculateAssets(totalAmount: bigint, inputAmount: bigint, operation: Operation): bigint {
  if (operation === 'add') {
    return (totalAmount || 0n) + (inputAmount || 0n);
  }
  return (totalAmount || 0n) - (inputAmount || 0n);
}

export default useAssetsToVotes;
