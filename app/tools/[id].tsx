import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ToolService } from '@/services/toolService';
import { useToolScreen } from '@/hooks/useToolScreen';
import { BackButton } from '@/components/ui/BackButton';
import { ToolHeader } from '@/components/ui/ToolHeader';
import { UploadCard } from '@/components/ui/UploadCard';
import { ProcessingCard } from '@/components/ui/ProcessingCard';
import { NotFoundState } from '@/components/ui/NotFoundState';
import { ToolScreenParams } from '@/types/tool.types';
import { THEME } from '@/constants/theme';

export default function ToolScreen(): JSX.Element {
  const { id } = useLocalSearchParams<ToolScreenParams>();
  const selectedTool = ToolService.findToolById(id);
  const { processingState, progressWidth, navigateBack, startProcessing } = useToolScreen(selectedTool);

  if (!selectedTool) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <NotFoundState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
        <BackButton onPress={navigateBack} />
        <ToolHeader tool={selectedTool} />
        
        {processingState.isProcessing ? (
          <ProcessingCard progressWidth={progressWidth} />
        ) : (
          <UploadCard onPress={startProcessing} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  screenContainer: {
    flex: 1,
    padding: THEME.spacing.md,
  },
});
