import { useSendTransaction } from 'wagmi';

export const useSetSessionKey = () => {
  const { sendTransactionAsync, isPending } = useSendTransaction();

  const setSessionKey = async (sessionKey: string) => {
    const cleanSessionKey = sessionKey.startsWith('0x') ? sessionKey.slice(2) : sessionKey;
    const data = `0x0a00${cleanSessionKey}00`;
    return sendTransactionAsync({
      to: '0x0000000000000000000000000000000000000401',
      data: data as `0x${string}`
    });
  };

  return { setSessionKey, isPending };
};
