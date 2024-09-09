import { Toaster } from 'sonner';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { DEFAULT_THEME } from '@/config/site';
import { useRainbowKitTheme } from '@/hooks/useRainbowKitTheme';
import useTheme from '@/hooks/useTheme';

import type { ReactNode } from 'react';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const rainbowKitTheme = useRainbowKitTheme();
  const { theme } = useTheme();

  return (
    <RainbowKitProvider
      theme={rainbowKitTheme}
      locale="en-US"
      appInfo={{ appName: import.meta.env.VITE_APP_NAME }}
    >
      {children}
      <Toaster
        richColors
        theme={(theme as 'dark' | 'light' | 'system') || DEFAULT_THEME}
        position="top-center"
      />
    </RainbowKitProvider>
  );
};
