export const BLACKLISTED_COLLATOR_TOOLTIP =
  'This collator account has a known exposure risk and cannot be supported.';

export const BLACKLISTED_COLLATOR_ADDRESSES = [
  '0xF2c0EB964C23c99D6c963f5aBD2d3ad31A6D6BC2',
  '0xF357142961Cd234aDEecc315c60a123bDF97c982',
  '0xdf8A3E0e8b38b07df2734eC99120487B46e0Aa1a',
  '0x4D224bC92540bF196e848025676F0835ebD0b72C'
] as const;

const blacklistedCollatorSet = new Set(
  BLACKLISTED_COLLATOR_ADDRESSES.map((address) => address.toLowerCase())
);

export const isBlacklistedCollator = (address?: string) => {
  return address ? blacklistedCollatorSet.has(address.toLowerCase()) : false;
};
