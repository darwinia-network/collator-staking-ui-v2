import { erc20Abi } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { address as depositAddress } from '@/config/abi/deposit';
import { useCallback } from 'react';

interface UseTokenAllowanceAndApproveProps {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  amount: bigint;
  enabled: boolean;
}
export const useTokenAllowanceAndApprove = ({
  tokenAddress,
  ownerAddress,
  amount,
  enabled
}: UseTokenAllowanceAndApproveProps) => {
  const queryClient = useQueryClient();

  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch: refetchAllowance,
    queryKey
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, depositAddress],
    query: {
      enabled
    }
  });

  const updateAllowance = useCallback(
    (value: bigint) => {
      queryClient.setQueryData(queryKey, () => {
        return value;
      });
    },
    [queryClient, queryKey]
  );

  const { writeContractAsync: approve, isPending: isWaitingApproving } = useWriteContract();

  const handleApprove = async () => {
    return await approve({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [depositAddress, amount]
    });
  };

  return {
    allowance,
    updateAllowance,
    isAllowanceLoading,
    refetchAllowance,
    isWaitingApproving,
    handleApprove
  };
};
