export const Colors = {
  // Primary Brand Colors
  primary: '#8A072D', // Royal Maroon (Main Brand Color)
  primaryDark: '#5D0D10', // Deep Burgundy (Dark backgrounds, headers)
  accentGold: '#E5A580', // Champagne Gold (Gold accents & highlights)
  goldLight: '#F3D09C',
  goldDark: '#BF784E',

  // Background & Pastel Accents
  backgroundLight: '#FBF3EF', // Ivory Cream (App background, splash)
  backgroundDark: '#1E060C', // Ultra Deep Royal Dark
  surfaceLight: '#FFFFFF',
  surfaceDark: '#2D0A14',
  cardLight: '#ECBFAB', // Soft Peach
  blushPink: '#F6D6CB', // Blush Pink (Icon circles, soft highlights)
  softPeach: '#ECBFAB', // Soft Peach

  // Status & UI
  textDark: '#2C0D16',
  textLight: '#FBF3EF',
  textMuted: '#8C6C75',
  textGold: '#E5A580',
  borderLight: '#F0D4CB',
  borderDark: '#4A1220',

  // Gradients
  gradients: {
    royalMaroon: ['#8A072D', '#5D0D10'] as const,
    champagneGold: ['#F6D6CB', '#E5A580', '#C68758'] as const,
    ivoryGlow: ['#FFFFFF', '#FBF3EF'] as const,
    darkBurgundy: ['#380812', '#1E060C'] as const,
  },
};

export type ThemeColors = typeof Colors;
