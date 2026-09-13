import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../theme';

interface RoyalCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'peach' | 'goldBorder' | 'burgundy';
}

export const RoyalCard: React.FC<RoyalCardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return (
    <View style={[styles.baseCard, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
  },
  elevated: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 3,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  peach: {
    backgroundColor: Colors.softPeach,
    borderWidth: 1,
    borderColor: '#E2AB93',
  },
  goldBorder: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: Colors.accentGold,
    elevation: 4,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  burgundy: {
    backgroundColor: Colors.primaryDark,
    borderWidth: 1,
    borderColor: Colors.accentGold,
  },
});
