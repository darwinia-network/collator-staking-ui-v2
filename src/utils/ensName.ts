import { ethers } from 'ethers';

const ethereumProvider = new ethers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/dfbe7a8f440b4342b6bada71dd3df498'
);

export const resolveEnsName = async (address) => {
  try {
    // Use the Ethereum provider to fetch the ENS name
    const ensName = await ethereumProvider.lookupAddress(address);

    if (ensName) {
      console.log('ENS Name:', ensName);
      return ensName;
    } else {
      console.log('No ENS name found for this address');
      return null;
    }
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return null;
  }
};
