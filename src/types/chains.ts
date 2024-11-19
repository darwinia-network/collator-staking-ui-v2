/**
 * Chain types.
 */
export enum ChainId {
  CRAB = 44,
  DARWINIA = 46
}

export const ktonToken = {
  [ChainId.CRAB]: 'CKTON',
  [ChainId.DARWINIA]: 'KTON'
};
