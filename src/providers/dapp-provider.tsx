import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';

import { NextUIProvider } from '@nextui-org/react';

import { config, queryClient } from '@/config/wagmi';

import { AppProvider } from './app-provider';
import '@rainbow-me/rainbowkit/styles.css';

export function DAppProvider({ children }: React.PropsWithChildren<unknown>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <AppProvider>{children}</AppProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
