import { TextStyle } from 'react-native';

export const Typography: { [key: string]: TextStyle } = {
  headerHero: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerLarge: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerMedium: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
};
