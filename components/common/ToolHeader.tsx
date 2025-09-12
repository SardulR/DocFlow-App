import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

interface ToolHeaderProps {
  toolName: string;
  toolDescription: string;
  toolIcon: keyof typeof Icon.glyphMap;
  onBack: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  toolName,
  toolDescription,
  toolIcon,
  onBack,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color={COLORS.mutedForeground} />
        <Text style={styles.backButtonText}>Back to Tools</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Icon name={toolIcon} size={32} color={COLORS.primary} />
        <View>
          <Text style={styles.title}>{toolName}</Text>
          <Text style={styles.subtitle}>{toolDescription}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 5,
  },
  backButtonText: {
    color: COLORS.mutedForeground,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mutedForeground,
  },
});