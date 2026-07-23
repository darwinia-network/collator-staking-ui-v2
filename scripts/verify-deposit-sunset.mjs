#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function read(path) {
  if (!existsSync(path)) {
    failures.push(`Missing required file: ${path}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

function requireIncludes(path, needle, label = needle) {
  const content = read(path);
  if (!content.includes(needle)) {
    failures.push(`Missing ${label} in ${path}`);
  }
}

function requireText(path, text, label = text) {
  const content = read(path).replace(/\s+/g, ' ');
  const normalizedText = text.replace(/\s+/g, ' ');
  if (!content.includes(normalizedText)) {
    failures.push(`Missing ${label} in ${path}`);
  }
}

function forbidIncludes(path, needle, label = needle) {
  const content = read(path);
  if (content.includes(needle)) {
    failures.push(`Forbidden ${label} remains in ${path}`);
  }
}

function requireCount(path, needle, count, label = needle) {
  const content = read(path);
  const actualCount = content.split(needle).length - 1;
  if (actualCount !== count) {
    failures.push(`Expected ${count} occurrences of ${label} in ${path}, found ${actualCount}`);
  }
}

function requireMissing(path, label = path) {
  if (existsSync(path)) {
    failures.push(`Retired ${label} still exists: ${path}`);
  }
}

requireIncludes('src/config/tabs.ts', "key: 'withdraw'", 'Withdraw navigation key');
requireIncludes('src/config/tabs.ts', "label: 'Withdraw'", 'Withdraw navigation label');
forbidIncludes('src/config/tabs.ts', "label: 'Deposit'", 'Deposit creation navigation label');
requireIncludes('src/config/tabs.ts', 'Stake Deposit', 'Stake page Deposit staking tab');

requireIncludes('src/routes/withdraw.tsx', "createFileRoute('/withdraw')", 'Withdraw route');
requireIncludes('src/routes/deposit.tsx', "to: '/withdraw'", 'legacy Deposit route redirect');

requireIncludes(
  'src/view/deposit/_components/index.tsx',
  'New RING deposits are no longer available.',
  'Deposit sunset notice'
);
requireIncludes(
  'src/view/deposit/_components/index.tsx',
  'https://gov.ringdao.com/proposal/0xf26faca1125af8f9813c5d88fecf533aa11d5a1b4f9b6dcd131c90206156dd1d',
  'governance proposal link'
);
requireIncludes(
  'src/view/deposit/_components/records.tsx',
  'My Deposit Tickets',
  'existing ticket heading'
);
requireIncludes(
  'src/view/deposit/_components/records.tsx',
  'Withdraw Early',
  'early withdrawal action'
);
requireCount(
  'src/view/deposit/_components/records.tsx',
  'currentTokenId !== undefined',
  2,
  'token ID zero-safe withdrawal cleanup'
);
requireCount(
  'src/view/deposit/_components/records.tsx',
  'isEnabled && depositList.length',
  2,
  'supported-chain ticket metadata and pagination'
);
requireIncludes(
  'src/view/deposit/_components/records.tsx',
  'enabled: isEnabled',
  'supported-chain ticket loading guard'
);
requireIncludes(
  'src/view/deposit/_components/records.tsx',
  'Switch to Darwinia to view existing deposit tickets',
  'wrong-network empty state'
);
requireIncludes(
  'src/view/deposit/_components/records.tsx',
  'switchChain({ chainId: getDefaultChainId() })',
  'wrong-network recovery action'
);
requireIncludes(
  'src/view/deposit/_components/records.tsx',
  'isDisabled={!isEnabled}',
  'withdrawal action supported-chain guard'
);
requireIncludes(
  'src/hooks/useUserDepositDetails.ts',
  'enabled: enabled && balanceNumber > 0',
  'token ID query supported-chain guard'
);
requireIncludes(
  'src/hooks/useUserDepositDetails.ts',
  'enabled: enabled && validTokenIds.length > 0',
  'ticket detail query supported-chain guard'
);
requireText(
  'src/hooks/useUserDepositDetails.ts',
  'if (!enabled) { setDepositList([]); return; }',
  'disabled ticket state reset'
);
requireIncludes(
  'src/view/deposit/_components/withdraw-earlier.tsx',
  'Withdraw early?',
  'explicit early withdrawal confirmation title'
);
requireText(
  'src/view/deposit/_components/withdraw-earlier.tsx',
  'Withdrawing now requires a penalty equal to three times the KTON reward.',
  'explicit early withdrawal penalty explanation'
);
requireIncludes(
  'src/view/deposit/_components/withdraw-earlier.tsx',
  'and withdraw',
  'explicit early withdrawal payment action'
);
forbidIncludes(
  'src/view/deposit/_components/index.tsx',
  'Deposit in Wallet',
  'legacy Deposit-in-wallet entry'
);
forbidIncludes(
  'src/view/deposit/_components/index.tsx',
  'Rewards you’ll receive',
  'new Deposit reward preview'
);
forbidIncludes(
  'src/view/deposit/_components/index.tsx',
  'Deposit term',
  'new Deposit term selector'
);

requireIncludes(
  'src/view/stake/_components/manage/index.tsx',
  'UnstakeDeposits',
  'existing Deposit unstaking support'
);
forbidIncludes(
  'src/view/stake/_components/manage/index.tsx',
  'StakeMoreDeposits',
  'new Deposit staking management entry'
);
requireIncludes(
  'src/view/stake/_components/new/index.tsx',
  'StakeDeposit',
  'Stake page Deposit staking flow'
);
requireIncludes(
  'src/view/stake/_components/new/stake-deposit.tsx',
  'DepositList',
  'selectable wallet Deposit list'
);
requireIncludes(
  'src/view/stake/_components/new/stake-deposit.tsx',
  'useApprovalForAll',
  'Deposit approval flow'
);
requireIncludes(
  'src/view/stake/_hooks/stake.ts',
  "functionName: 'stakeDeposits'",
  'Deposit staking transaction'
);

requireMissing('src/view/deposit/_hooks/deposit.ts', 'new Deposit write hook');
requireMissing('src/view/deposit/_hooks/compute-interest.ts', 'new Deposit reward preview hook');
requireMissing('src/view/deposit/_components/rewards.tsx', 'new Deposit reward preview component');
requireMissing(
  'src/view/stake/_components/manage/stake-more-deposits.tsx',
  'new Deposit staking management component'
);
requireIncludes(
  'src/components/deposit-list.tsx',
  'useUserDepositDetails',
  'selectable wallet Deposit staking list'
);
requireIncludes(
  'src/components/deposit-item.tsx',
  'DepositInfo',
  'selectable wallet Deposit staking item'
);

if (failures.length > 0) {
  console.error('Deposit sunset design contract failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Deposit sunset design contract passed.');
