import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { THEME } from '@/constants/theme';

interface ProcessingCardProps {
  progressWidth: Animated.AnimatedAddition;
  message?: string;
}

export const ProcessingCard: React.FC<ProcessingCardProps> = ({
  progressWidth,
  message = 'Processing your file...',
}) => (
  <View style={styles.container} testID="processing-card">
    <Icon name="sync" size={40} color={THEME.colors.primary} />
    <Text style={styles.text}>{message}</Text>
    <View style={styles.progressBarBackground}>
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: THEME.spacing.xxl,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
  },
  text: {
    fontSize: THEME.typography.sizes.subtitle,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  progressBarBackground: {
    height: 8,
    width: '100%',
    backgroundColor: `${THEME.colors.primary}30`,
    borderRadius: THEME.borderRadius.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
  },
});