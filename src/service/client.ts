import { ChainId } from '@/types/chains';
import { GraphQLClient } from 'graphql-request';

export const darwiniaClient = new GraphQLClient(import.meta.env.VITE_DARWINIA_GRAPHQL_API_URL);

export function getClient(chainId: ChainId) {
  switch (chainId) {
    case ChainId.DARWINIA:
      return darwiniaClient;
    default:
      throw new Error('Invalid chainId');
  }
}
