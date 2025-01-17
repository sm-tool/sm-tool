import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface DarkMode {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const DarkModeContext = React.createContext<DarkMode | null>(null);

const updateClassList = (theme: Theme) => {
  const elements = [
    globalThis.document.documentElement,
    globalThis.document.body,
  ];
  for (const element of elements) {
    element.classList[theme === 'dark' ? 'add' : 'remove']('dark');
  }
};

const createDarkMode = (initialTheme: Theme = 'dark'): DarkMode => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = globalThis.localStorage.getItem('theme');
    return (stored as Theme) || initialTheme;
  });

  useEffect(() => {
    updateClassList(theme);
    globalThis.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  };
};

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const darkMode = createDarkMode('dark');

  return (
    <DarkModeContext.Provider value={darkMode}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = (): DarkMode => {
  const context = React.useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
export default useDarkMode;
