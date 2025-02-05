import { ethers } from 'ethers';

const ethereumProvider = new ethers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/dfbe7a8f440b4342b6bada71dd3df498'
);

const ensCache = new Map<string, string>();
const failedRequests = new Set<string>();
const RETRY_DELAY = 1000; // 1 second delay
const REQUEST_DELAY = 200; // 500ms between requests

// Add a map to track pending promises
const pendingRequests = new Map<string, Promise<string | null>>();

// Add a queue to manage requests
const requestQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

// Function to process the queue
async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
    }
  }
  isProcessingQueue = false;
}

export const getEnsName = async (connectedAddress: string) => {
  if (!connectedAddress) return;

  // Check cache first
  if (ensCache.has(connectedAddress)) {
    const name = ensCache.get(connectedAddress);
    if (name === 'noName') return;
    return name;
  }

  // Check if there's already a pending request for this address
  if (pendingRequests.has(connectedAddress)) {
    return pendingRequests.get(connectedAddress);
  }

  // Create new promise for this request
  const promise = new Promise<string | null>((resolve) => {
    const queuedRequest = async () => {
      if (failedRequests.has(connectedAddress)) {
        resolve(null);
        return;
      }

      try {
        const name = await resolveEnsName(connectedAddress);
        ensCache.set(connectedAddress, name || 'noName');
        resolve(name);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'message' in error) {
          if (typeof error.message === 'string' && error.message.includes('429')) {
            failedRequests.add(connectedAddress);

            setTimeout(() => {
              failedRequests.delete(connectedAddress);
            }, RETRY_DELAY);
          }
        }
        resolve(null);
      } finally {
        pendingRequests.delete(connectedAddress);
      }
    };

    requestQueue.push(queuedRequest);
    processQueue();
  });

  // Store the promise
  pendingRequests.set(connectedAddress, promise);

  return promise;
};

export const resolveEnsName = async (address: string) => {
  const ensName = await ethereumProvider.lookupAddress(address);
  return ensName;
};
