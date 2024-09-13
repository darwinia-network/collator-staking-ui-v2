import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

import { abi, address } from '@/config/abi/deposit';
import { error } from '@/components/toast';

type DepositProps = {
  months?: string;
  value?: string;
};

const useDeposit = () => {
  const result = useWriteContract();

  const handleDeposit = useCallback(
    ({ months, value }: DepositProps) => {
      const num = parseEther(value || '0');
      if (num < parseEther('0.0000000000001')) {
        error('The deposit amount is too small');
        return;
      }
      if (!months || !value) return;
      return result.writeContractAsync({
        address,
        abi,
        functionName: 'deposit',
        args: [BigInt(months)],
        value: parseEther(value)
      });
    },
    [result]
  );

  return { ...result, handleDeposit };
};

export default useDeposit;
