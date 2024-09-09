import { useReadContract } from 'wagmi';
import { abi, address } from '@/config/abi/deposit';

export function useGetWithdrawPenalty(tokenId?: bigint) {
  const { data: computePenaltyData, isLoading: computePenaltyLoading } = useReadContract({
    address,
    abi,
    functionName: 'computePenalty',
    args: [tokenId!],
    query: {
      enabled: !!tokenId
    }
  });

  return {
    value: computePenaltyData ? BigInt(computePenaltyData?.toString()) : 0n,
    isLoading: computePenaltyLoading
  };
}

export default useGetWithdrawPenalty;
