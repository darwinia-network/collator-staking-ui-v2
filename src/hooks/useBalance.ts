import { useMemo } from 'react';
import { useBalance as useBalanceFromWagmi } from 'wagmi';
import { formatEther } from 'viem';

import useWalletStatus from './useWalletStatus';

const useBalance = () => {
  const { isEnabled, address } = useWalletStatus();

  const result = useBalanceFromWagmi({
    address,
    query: {
      enabled: isEnabled
    }
  });

  const formatted = useMemo(() => {
    if (result?.data?.value) {
      return formatEther(result.data.value);
    }
    return '0';
  }, [result?.data]);

  return {
    ...result,
    formatted,
    isLoading: result.isLoading || result.isRefetching
  };
};

export default useBalance;
