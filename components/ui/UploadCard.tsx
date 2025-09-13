import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { THEME } from '@/constants/theme';

interface UploadCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onPress,
  title = 'Upload your files',
  subtitle = 'Tap here to browse files',
}) => (
  <TouchableOpacity onPress={onPress} testID="upload-card">
    <View style={styles.container}>
      <Icon name="upload" size={40} color={THEME.colors.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: `${THEME.colors.primary}60`,
    borderStyle: 'dashed',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${THEME.colors.primary}10`,
  },
  title: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.text,
    marginTop: THEME.spacing.md,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.body,
    color: THEME.colors.mutedForeground,
    marginTop: THEME.spacing.xs,
  },
});
