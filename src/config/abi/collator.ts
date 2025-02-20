export const address = '0xa713B8bf2D91b60BA4556fDFF7fF1E8B60A5064D';
export const abi = [
  {
    inputs: [],
    name: 'getActiveCollatorCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getActiveCollators',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes28',
        name: 'owner',
        type: 'bytes28'
      }
    ],
    name: 'getSessionKey',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
