/**
 * Chain types.
 */
export enum ChainId {
  CRAB = 44,
  DARWINIA = 46,
  KOI = 701
}

export const ktonToken = {
  [ChainId.CRAB]: 'CKTON',
  [ChainId.DARWINIA]: 'KTON',
  [ChainId.KOI]: 'PKTON'
};
