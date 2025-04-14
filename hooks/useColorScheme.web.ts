import { useThemeContext } from '@/hooks/useThemeContext';

export function useColorScheme() {
  const { colorScheme } = useThemeContext();
  return colorScheme;
}