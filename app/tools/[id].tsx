import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Alert, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TOOLS } from '@/constants/tools';
import { COLORS } from '@/constants/Colors';
import { ToolHeader } from '@/components/common/ToolHeader';
import { FileUpload } from '@/components/common/FileUpload';
import { ProcessingStatus } from '@/components/common/ProcessingStatus';
import { ToolService } from '../services/ToolService';
import { ProcessingStatus as ProcessingStatusType } from '@/types/tool.types';

export default function ToolScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedTool = TOOLS.find(tool => tool.id === id);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatusType>({
    isProcessing: false,
    progress: 0,
    message: '',
  });

  const navigateBackSafely = () => {
    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleFileSelect = async (files: any[]) => {
    if (!selectedTool) return;

    setProcessingStatus({
      isProcessing: true,
      progress: 0,
      message: `Processing with ${selectedTool.name}...`,
    });

    try {
      // Simulate progress updates
      const progressSteps = [20, 40, 60, 80, 100];
      for (let i = 0; i < progressSteps.length; i++) {
        setTimeout(() => {
          setProcessingStatus(prev => ({
            ...prev,
            progress: progressSteps[i],
            message: i === progressSteps.length - 1 
              ? 'Finalizing...' 
              : `Processing with ${selectedTool.name}...`,
          }));
        }, i * 400);
      }

      // Process the files
      const result = await ToolService.processFiles(selectedTool.id, files);

      setTimeout(() => {
        setProcessingStatus({
          isProcessing: false,
          progress: 100,
          message: '',
        });

        Alert.alert(
          result.success ? "Success!" : "Error",
          result.message,
          [
            {
              text: "OK",
              onPress: () => {
                if (result.success) {
                  navigateBackSafely();
                }
              },
            },
          ],
          { cancelable: false }
        );
      }, 2000);

    } catch (_error) {
      setProcessingStatus({
        isProcessing: false,
        progress: 0,
        message: '',
        error: 'An error occurred during processing',
      });

      Alert.alert("Error", "Failed to process files. Please try again.");
    }
  };

  if (!selectedTool) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <ToolHeader 
          toolName="Not Found"
          toolDescription="Tool not found"
          toolIcon="alert-circle-outline"
          onBack={navigateBackSafely}
        />
      </SafeAreaView>
    );
  }

  const toolConfig = {
    ...selectedTool,
    ...ToolService.getToolConfig(selectedTool.id)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screenContainer}>
        <ToolHeader 
          toolName={selectedTool.name}
          toolDescription={selectedTool.description}
          toolIcon={selectedTool.icon}
          onBack={navigateBackSafely}
        />

        {processingStatus.isProcessing ? (
          <ProcessingStatus status={processingStatus} />
        ) : (
          <FileUpload 
            toolConfig={toolConfig}
            onFileSelect={handleFileSelect}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  screenContainer: { 
    flex: 1, 
    padding: 15 
  },
});