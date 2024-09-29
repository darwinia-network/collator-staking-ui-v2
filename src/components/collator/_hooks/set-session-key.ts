import useWalletStatus from '@/hooks/useWalletStatus';
import { ChainId } from '@/types/chains';
import { useSendTransaction } from 'wagmi';

const getData = (sessionKey: string, chainId: ChainId) => {
  switch (chainId) {
    case ChainId.DARWINIA:
    case ChainId.CRAB:
      return `0x0d00${sessionKey}00`;
    case ChainId.KOI:
      return `0x0a00${sessionKey}00`;
    default:
      return '';
  }
};

export const useSetSessionKey = () => {
  const { currentChainId } = useWalletStatus();

  const { sendTransactionAsync, isPending } = useSendTransaction();
  const setSessionKey = async (sessionKey: string) => {
    if (!currentChainId) {
      return;
    }
    const cleanSessionKey = sessionKey.startsWith('0x') ? sessionKey.slice(2) : sessionKey;
    const data = getData(cleanSessionKey, currentChainId);
    return sendTransactionAsync({
      to: '0x0000000000000000000000000000000000000401',
      data: data as `0x${string}`
    });
  };

  return { setSessionKey, isPending };
};
