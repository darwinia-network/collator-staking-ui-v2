export const address = '0x9a005e083d9696423f715ae45c48af2e11a37079';
export const abi = [
  {
    inputs: [],
    name: 'getContractCollators',
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
