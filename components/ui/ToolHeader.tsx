import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Tool } from '../../types/tool.types';
import { THEME } from '@/constants/theme';

interface ToolHeaderProps {
  tool: Tool;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ tool }) => (
  <View style={styles.container} testID="tool-header">
    <Icon name={tool.icon} size={32} color={THEME.colors.primary} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{tool.name}</Text>
      <Text style={styles.subtitle}>{tool.description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: THEME.typography.sizes.heading,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.body,
    color: THEME.colors.mutedForeground,
    marginTop: THEME.spacing.xs,
  },
});
