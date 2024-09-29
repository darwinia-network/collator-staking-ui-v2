export const address = '0x969E48c6BFA01031A930FCcF9C4D4876dD76fB3e';
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
