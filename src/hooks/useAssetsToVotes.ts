import { useReadContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { isNil } from 'lodash-es';
import useWalletStatus from './useWalletStatus';

export type Operation = 'add' | 'subtract';

interface AssetsToVotesProps {
  commission: bigint;
  totalAmount: bigint;
  inputAmount: bigint;
  operation: Operation;
}

function useAssetsToVotes({ commission, totalAmount, inputAmount, operation }: AssetsToVotesProps) {
  const { isEnabled } = useWalletStatus();

  const result = useReadContract({
    abi,
    address,
    functionName: 'assetsToVotes',
    args: [commission, calculateAssets(totalAmount, inputAmount, operation)],
    query: {
      enabled: isEnabled && !isNil(totalAmount) && !isNil(inputAmount)
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
