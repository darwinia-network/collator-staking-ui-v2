/**
 * Shortens a given address if its length exceeds a specified threshold.
 *
 * This function retains the first 5 characters and the last 4 characters of the address,
 * inserting ellipsis (...) in between if the address is longer than 16 characters.
 * If the address is 16 characters or shorter, it returns the address unchanged.
 *
 * @param {string} address - The address to be shortened.
 * @returns {string} The shortened address or the original address if it's not longer than 16 characters.
 */
export function toShortAddress(address?: string) {
  if (!address) return '';
  return address?.length > 16 ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : address;
}

type GenKeyParams = {
  votes: bigint;
  address?: string;
};
export function genKey({ address, votes }: GenKeyParams) {
  if (!address) return '';
  const _stdAddr = address?.toLowerCase().replace('0x', '');
  const _stdVotes = votes.toString(16).padStart(64, '0');
  return `${_stdVotes}-${_stdAddr}`;
}
