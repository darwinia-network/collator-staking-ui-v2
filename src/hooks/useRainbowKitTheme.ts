import useTheme from '@/hooks/useTheme';
import { darkTheme, lightTheme } from '@rainbow-me/rainbowkit';

export const dark = darkTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--nextui-primary-500))'
});

export const light = lightTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--nextui-primary-500))'
});

export function useRainbowKitTheme() {
  const { theme } = useTheme();

  return theme === 'dark' ? dark : light;
}
