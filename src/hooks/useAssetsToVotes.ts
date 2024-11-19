import { useReadContract } from 'wagmi';
import { abi, address } from '@/config/abi/hub';
import { readContract } from '@wagmi/core';
import { config } from '@/config/wagmi';

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
      enabled: false
    }
  });

  return result;
}

export async function assetsToVotes(
  commission: bigint,
  totalAmount: bigint,
  inputAmount: bigint,
  operation: Operation
): Promise<bigint> {
  return (await readContract(config, {
    abi,
    address,
    functionName: 'assetsToVotes',
    args: [commission, calculateAssets(totalAmount, inputAmount, operation)]
  })) as unknown as bigint;
}

function calculateAssets(totalAmount: bigint, inputAmount: bigint, operation: Operation): bigint {
  if (operation === 'add') {
    return (totalAmount || 0n) + (inputAmount || 0n);
  }
  return (totalAmount || 0n) - (inputAmount || 0n);
}

export default useAssetsToVotes;
