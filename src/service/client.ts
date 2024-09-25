import { ChainId } from '@/types/chains';
import { GraphQLClient } from 'graphql-request';

export const koiClient = new GraphQLClient(import.meta.env.VITE_KOI_GRAPHQL_API_URL);
export const crabClient = new GraphQLClient(import.meta.env.VITE_CRAB_GRAPHQL_API_URL);
export const darwiniaClient = new GraphQLClient(import.meta.env.VITE_DARWINIA_GRAPHQL_API_URL);

export function getClient(chainId: ChainId) {
  switch (chainId) {
    case ChainId.KOI:
      return koiClient;
    case ChainId.CRAB:
      return crabClient;
    case ChainId.DARWINIA:
      return darwiniaClient;
    default:
      throw new Error('Invalid chainId');
  }
}
