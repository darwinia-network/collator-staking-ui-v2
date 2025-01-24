import { ethers } from 'ethers';

const ethereumProvider = new ethers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/dfbe7a8f440b4342b6bada71dd3df498'
);

const ensCache = new Map<string, string>();
const failedRequests = new Set<string>();
const RETRY_DELAY = 1000; // 1 second delay

// Add a map to track pending promises
const pendingRequests = new Map<string, Promise<string | null>>();

export const getEnsName = async (connectedAddress: string) => {
  console.log("Getting ENS name for:", connectedAddress);
  if (!connectedAddress) return;

  // Check cache first
  if (ensCache.has(connectedAddress)) {
    const name = ensCache.get(connectedAddress);
    if (name === 'noName') return;
    return name;
  }

  // Check if there's already a pending request for this address
  if (pendingRequests.has(connectedAddress)) {
    console.log("Using existing pending request for:", connectedAddress);
    return pendingRequests.get(connectedAddress);
  }

  // Create new promise for this request
  const promise = (async () => {
    if (failedRequests.has(connectedAddress)) {
      return null;
    }

    try {
      const name = await resolveEnsName(connectedAddress);
      ensCache.set(connectedAddress, name || 'noName');
      console.log("ENS Cache updated:", ensCache);
      return name;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        if (typeof error.message === 'string' && error.message.includes('429')) {
          failedRequests.add(connectedAddress);
          console.log("Failed Requests:", failedRequests);
          
          setTimeout(() => {
            failedRequests.delete(connectedAddress);
          }, RETRY_DELAY);
        }
      }
      return null;
    } finally {
      // Clean up the pending request
      pendingRequests.delete(connectedAddress);
    }
  })();

  // Store the promise
  pendingRequests.set(connectedAddress, promise);

  return promise;
};

export const resolveEnsName = async (address: string) => {
  const ensName = await ethereumProvider.lookupAddress(address);
  console.log('Address:', address);
  console.log('ENS Name:', ensName);
  return ensName;
};
