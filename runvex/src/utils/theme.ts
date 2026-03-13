import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  primary: '#00C8FF',      // Cyan/blue neón
  secondary: '#FF6B00',    // Orange neón
  accent: '#FFD700',       // Gold
  background: '#000000',
  backgroundDark: '#050A15',
  card: 'rgba(255,255,255,0.08)',
  cardBorder: 'rgba(255,255,255,0.75)',
  text: '#FFFFFF',
  textSecondary: '#B0B8C8',
  textMuted: '#6B7280',
  success: '#00FF88',
  danger: '#FF3B30',
  warning: '#FF9500',
  transparent: 'transparent',
};

export const FONTS = {
  audiowide: 'Audiowide_400Regular',
  daysOne: 'DaysOne_400Regular',
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 25,
  xl: 32,
  full: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bottom tab bar height
export const TAB_BAR_HEIGHT = 64;

// Figma design base width for scaling
export const BASE_WIDTH = 412;
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
