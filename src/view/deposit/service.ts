import { abi, address } from '@/config/abi/deposit';
import { config } from '@/config/wagmi';
import { Config, readContract } from '@wagmi/core';

export const checkIsClaimRequirePenalty = async (tokenId: bigint) => {
  const result = await readContract(config as unknown as Config, {
    abi,
    address,
    functionName: 'isClaimRequirePenalty',
    args: [tokenId]
  });
  return result;
};
