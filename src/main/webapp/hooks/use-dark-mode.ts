import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface DarkMode {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const updateClassList = (isDark: boolean) => {
  const elements = [
    globalThis.document.documentElement,
    globalThis.document.body,
  ];
  for (const element of elements) {
    element.classList[isDark ? 'add' : 'remove']('dark');
  }
};

const getSystemTheme = () =>
  globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const useDarkMode = (initialTheme: Theme = 'system'): DarkMode => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = globalThis.localStorage.getItem('theme');
    return (stored as Theme) || initialTheme;
  });

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(getSystemTheme() === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const applyTheme = (theme: Theme) => {
    const isDark =
      theme === 'system' ? getSystemTheme() === 'dark' : theme === 'dark';

    updateClassList(isDark);
    globalThis.localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    systemTheme: getSystemTheme(),
    toggleTheme,
  };
};

export default useDarkMode;
