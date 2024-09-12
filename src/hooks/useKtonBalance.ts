import { erc20Abi, formatEther } from 'viem';
import useWalletStatus from './useWalletStatus';
import { useReadContract } from 'wagmi';

export const useKtonBalance = () => {
  const { address, isEnabled, ktonInfo } = useWalletStatus();
  const result = useReadContract({
    address: ktonInfo?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: isEnabled && !!ktonInfo?.address
    }
  });
  return { ...result, formatted: formatEther(result.data ?? BigInt(0)) };
};
