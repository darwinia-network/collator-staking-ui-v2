import { useReadContract } from 'wagmi';
import { parseEther } from 'viem';

import { abi, address } from '@/config/abi/deposit';
import useWalletStatus from '@/hooks/useWalletStatus';

const useComputeInterest = (amount?: string, selectedMonthPeriod?: string) => {
  const { isEnabled } = useWalletStatus();
  const result = useReadContract({
    address,
    abi,
    functionName: 'computeInterest',
    args: [
      amount ? parseEther(amount) : BigInt(0),
      selectedMonthPeriod ? BigInt(selectedMonthPeriod) : BigInt(0)
    ],
    query: {
      enabled: !!isEnabled && !!address && amount !== '0' && !!selectedMonthPeriod
    }
  });

  return result;
};

export default useComputeInterest;
