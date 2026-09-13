import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface RoyalHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const RoyalHeader: React.FC<RoyalHeaderProps> = ({
  title,
  subtitle,
  showLogo = false,
  onBack,
  rightAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        )}
        {showLogo ? (
          <Image
            source={Assets.logoLight}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}
      </View>
      {rightAction && <View style={styles.rightSection}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  logo: {
    width: 140,
    height: 44,
  },
  title: {
    ...Typography.headerMedium,
    color: Colors.primaryDark,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  backButton: {
    paddingRight: Spacing.sm,
  },
  backText: {
    fontSize: 28,
    color: Colors.primary,
    lineHeight: 30,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
