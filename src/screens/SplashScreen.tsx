import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../theme';
import { Assets } from '../constants/assets';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5D0D10" />
      <LinearGradient
        colors={['#5D0D10', '#8A072D', '#2A040C']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={Assets.logoDark}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.badgeContainer}>
          <Text style={styles.tagline}>Royal Wedding & Baarat Experience</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  logo: {
    width: 320,
    height: 280,
  },
  badgeContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.round,
    backgroundColor: 'rgba(229, 165, 128, 0.15)',
    borderWidth: 1,
    borderColor: Colors.accentGold,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.accentGold,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
