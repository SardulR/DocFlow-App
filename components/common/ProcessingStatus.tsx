import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { ProcessingStatus as ProcessingStatusType } from '@/types/tool.types';

interface ProcessingStatusProps {
  status: ProcessingStatusType;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: status.progress,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animate loading spinner
    if (status.isProcessing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [status.progress, status.isProcessing, progressAnim, spinAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const spinRotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!status.isProcessing) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spinRotation }] }]}>
        <Icon name="sync" size={40} color={COLORS.primary} />
      </Animated.View>
      <Text style={styles.message}>{status.message}</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
      <Text style={styles.progressText}>{Math.round(status.progress)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.card,
    borderRadius: 16,
  },
  iconContainer: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 8,
    width: '100%',
    backgroundColor: `${COLORS.primary}30`,
    borderRadius: 4,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    fontWeight: '600',
  },
});