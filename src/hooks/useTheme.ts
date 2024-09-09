import useDarkMode from 'use-dark-mode';

// if (typeof window !== "undefined") {
//   console.log("window.matchMedia", window.matchMedia);
//   (window as Window & typeof globalThis).matchMedia =
//     null as unknown as typeof window.matchMedia;
// }

const useTheme = () => {
  const darkMode = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
    element: document.documentElement
  });

  const theme = darkMode.value ? 'dark' : 'light';

  return { theme, toggle: darkMode.toggle };
};

export default useTheme;
