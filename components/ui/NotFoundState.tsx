import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { THEME } from '@/constants/theme';

interface NotFoundStateProps {
  title?: string;
  message?: string;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  title = 'Tool not found',
  message = 'The requested tool could not be found.',
}) => (
  <View style={styles.container} testID="not-found-state">
    <Icon name="alert-circle-outline" size={64} color={THEME.colors.mutedForeground} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.sizes.heading,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text,
    marginTop: THEME.spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: THEME.typography.sizes.body,
    color: THEME.colors.mutedForeground,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
});