import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { ToolConfig } from '@/types/tool.types';

interface FileUploadProps {
  toolConfig: ToolConfig;
  onFileSelect: (files: any[]) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  toolConfig,
  onFileSelect,
  disabled = false,
}) => {
  const handleUpload = async () => {
    if (disabled) return;

    try {
      // Here you would implement actual file picker logic
      // For now, we'll simulate file selection
      
      Alert.alert(
        'File Selection',
        `Select ${toolConfig.allowMultiple ? 'files' : 'a file'} for ${toolConfig.name}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Select Files',
            onPress: () => {
              // Simulate file selection
              const mockFiles = [{ name: 'sample.pdf', size: 1024 * 1024 }];
              onFileSelect(mockFiles);
            },
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to select files. Please try again.');
    }
  };

  const getUploadText = () => {
    const fileTypes = toolConfig.acceptedFileTypes?.join(', ') || 'files';
    return toolConfig.allowMultiple 
      ? `Upload your ${fileTypes}` 
      : `Upload your ${fileTypes.slice(0, -1)}`; // Remove 's' for singular
  };

  return (
    <TouchableOpacity onPress={handleUpload} disabled={disabled}>
      <View style={[styles.uploadCard, disabled && styles.uploadCardDisabled]}>
        <Icon 
          name="upload" 
          size={40} 
          color={disabled ? COLORS.mutedForeground : COLORS.primary} 
        />
        <Text style={[styles.uploadTitle, disabled && styles.uploadTitleDisabled]}>
          {getUploadText()}
        </Text>
        <Text style={styles.uploadSubtitle}>
          {toolConfig.allowMultiple ? 'Tap here to browse files' : 'Tap here to browse file'}
        </Text>
        {toolConfig.acceptedFileTypes && (
          <Text style={styles.acceptedTypes}>
            Accepted: {toolConfig.acceptedFileTypes.join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadCard: {
    borderWidth: 2,
    borderColor: `${COLORS.primary}60`,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.primary}10`,
  },
  uploadCardDisabled: {
    borderColor: `${COLORS.mutedForeground}40`,
    backgroundColor: `${COLORS.mutedForeground}10`,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
  },
  uploadTitleDisabled: {
    color: COLORS.mutedForeground,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    marginTop: 5,
  },
  acceptedTypes: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginTop: 10,
    textAlign: 'center',
  },
});