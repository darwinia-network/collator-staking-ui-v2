export const address = '0xa4fFAC7A5Da311D724eD47393848f694Baee7930';
export const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    type: 'error',
    name: 'AddressInsufficientBalance'
  },
  {
    inputs: [],
    type: 'error',
    name: 'FailedInnerCall'
  },
  {
    inputs: [],
    type: 'error',
    name: 'InvalidInitialization'
  },
  {
    inputs: [],
    type: 'error',
    name: 'NotInitializing'
  },
  {
    inputs: [],
    type: 'error',
    name: 'ReentrancyGuardReentrantCall'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'cur',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'uint256',
        name: 'votes',
        type: 'uint256',
        indexed: false
      },
      {
        internalType: 'address',
        name: 'prev',
        type: 'address',
        indexed: false
      }
    ],
    type: 'event',
    name: 'AddCollator',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'uint256',
        name: 'commission',
        type: 'uint256',
        indexed: false
      }
    ],
    type: 'event',
    name: 'CommissionUpdated',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
        indexed: false
      }
    ],
    type: 'event',
    name: 'Initialized',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'address',
        name: 'collator',
        type: 'address',
        indexed: false
      }
    ],
    type: 'event',
    name: 'NominationPoolCreated',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'cur',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'address',
        name: 'prev',
        type: 'address',
        indexed: false
      }
    ],
    type: 'event',
    name: 'RemoveCollator',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
        indexed: false
      }
    ],
    type: 'event',
    name: 'RewardDistributed',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'address',
        name: 'collator',
        type: 'address',
        indexed: false
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
        indexed: false
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
        indexed: false
      }
    ],
    type: 'event',
    name: 'Staked',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'address',
        name: 'collator',
        type: 'address',
        indexed: false
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
        indexed: false
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
        indexed: false
      }
    ],
    type: 'event',
    name: 'Unstaked',
    anonymous: false
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'cur',
        type: 'address',
        indexed: true
      },
      {
        internalType: 'uint256',
        name: 'votes',
        type: 'uint256',
        indexed: false
      },
      {
        internalType: 'address',
        name: 'oldPrev',
        type: 'address',
        indexed: false
      },
      {
        internalType: 'address',
        name: 'newPrev',
        type: 'address',
        indexed: false
      }
    ],
    type: 'event',
    name: 'UpdateCollator',
    anonymous: false
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'COMMISSION_LOCK_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'DEPOSIT',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ]
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'STAKING_LOCK_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'SYSTEM_PALLET',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'c',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: '_isInactiveCollator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'commission',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256'
      }
    ],
    stateMutability: 'pure',
    type: 'function',
    name: 'assetsToVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'claim'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'prev',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'commission',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'collate'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'collators',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'commissionLocks',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'commissionOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'count',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'prev',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'commission',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'createAndCollate',
    outputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address'
      }
    ]
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'createNominationPool',
    outputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'depositInfos',
    outputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      }
    ],
    stateMutability: 'payable',
    type: 'function',
    name: 'distributeReward'
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'gRING',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'k',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'getTopCollators',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'gring',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'dps',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'initialize'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'poolOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'depositIds',
        type: 'uint256[]'
      },
      {
        internalType: 'address',
        name: 'oldPrev',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'newPrev',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'stakeDeposits'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'oldPrev',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'newPrev',
        type: 'address'
      }
    ],
    stateMutability: 'payable',
    type: 'function',
    name: 'stakeRING'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakedDepositsAt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'depositId',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakedDepositsContains',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakedDepositsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakedDepositsOf',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakedOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakedRINGOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'stakingLocks',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'prev',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'stopCollation'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'depositIds',
        type: 'uint256[]'
      },
      {
        internalType: 'address',
        name: 'oldPrev',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'newPrev',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'unstakeDeposits'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'depositIds',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'unstakeDepositsFromInactiveCollator'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'oldPrev',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'newPrev',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'unstakeRING'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collator',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'unstakeRINGFromInactiveCollator'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'commission',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'oldPrev',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'newPrev',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'updateCommission'
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'updateTimeStamp',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'votesOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ]
  }
] as const;
