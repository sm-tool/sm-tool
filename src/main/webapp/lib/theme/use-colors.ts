import { colors } from '@/lib/theme/colors.config.ts';
import useDarkMode from '@/hooks/use-dark-mode.tsx';

export const useColors = () => {
  const { theme } = useDarkMode();
  return colors[theme as keyof typeof colors];
};
