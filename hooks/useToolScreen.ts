import { useRef, useState, useCallback } from 'react';
import { Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Tool, ProcessingState } from '../types/tool.types';
import { ANIMATION_CONFIG } from '@/constants/animations';

export const useToolScreen = (selectedTool: Tool | undefined) => {
  const router = useRouter();
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
  });
  const progressAnim = useRef(new Animated.Value(0)).current;

  const navigateBack = useCallback(() => {
    try {
      if (typeof router.canGoBack === 'function' && router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.replace('/');
    }
  }, [router]);

  const showSuccessAlert = useCallback(() => {
    Alert.alert(
      'Success!',
      `${selectedTool?.name} completed successfully.`,
      [
        {
          text: 'OK',
          onPress: navigateBack,
        },
      ],
      { cancelable: false }
    );
  }, [selectedTool?.name, navigateBack]);

  const startProcessing = useCallback(() => {
    setProcessingState({ isProcessing: true, progress: 0 });
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 100,
      duration: ANIMATION_CONFIG.duration.long,
      useNativeDriver: false,
    }).start(() => {
      setProcessingState({ isProcessing: false, progress: 100 });
      showSuccessAlert();
    });
  }, [progressAnim, showSuccessAlert]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return {
    processingState,
    progressWidth,
    navigateBack,
    startProcessing,
  };
};