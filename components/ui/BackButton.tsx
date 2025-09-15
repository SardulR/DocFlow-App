import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { THEME } from '@/constants/theme';

interface BackButtonProps {
  onPress?: () => void;   // now optional
  title?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  title = 'Back to Tools' 
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/"); // 👈 fallback route
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} testID="back-button">
      <Icon name="arrow-left" size={20} color={THEME.colors.mutedForeground} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.xs,
  },
  text: {
    color: THEME.colors.mutedForeground,
    fontSize: THEME.typography.sizes.body,
    fontWeight: THEME.typography.weights.regular,
  },
});
