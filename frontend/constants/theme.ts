export interface AppTheme {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  primaryText: string;
  border: string;
  accent: string;
  danger: string;
  chipBackground: string;
}

export const lightTheme: AppTheme = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2c3e50',
  subtext: '#7f8c8d',
  primary: '#4A90E2',
  primaryText: '#ffffff',
  border: '#ecf0f1',
  accent: '#F7B731',
  danger: '#FF6B6B',
  chipBackground: '#ffffff',
};

export const darkTheme: AppTheme = {
  background: '#12151a',
  card: '#1c2128',
  text: '#e8eaed',
  subtext: '#9aa4b2',
  primary: '#5B9BF0',
  primaryText: '#ffffff',
  border: '#2a2f38',
  accent: '#F7B731',
  danger: '#FF6B6B',
  chipBackground: '#1c2128',
};

export function getTheme(isDark: boolean): AppTheme {
  return isDark ? darkTheme : lightTheme;
}
