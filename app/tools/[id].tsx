// File: app/tools/[id].tsx

import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { TOOLS } from '@/constants/tools';

const COLORS = {
  primary: "#d90429",
  background: "#edf2f4",
  card: "#FFFFFF",
  text: "#2b2d42",
  mutedForeground: "#8d99ae",
};

// Ensure this line is exactly "export default function..."
export default function ToolScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedTool = TOOLS.find(tool => tool.id === id);

  const [isProcessing, setIsProcessing] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleFileUpload = () => {
    setIsProcessing(true);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsProcessing(false);
      Alert.alert("Success!", `${selectedTool?.name} completed successfully.`);
      router.back();
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  if (!selectedTool) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.title}>Tool not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screenContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={COLORS.mutedForeground} />
          <Text style={styles.backButtonText}>Back to Tools</Text>
        </TouchableOpacity>
        <View style={[styles.header, { marginBottom: 30 }]}>
          <Icon name={selectedTool.icon} size={32} color={COLORS.primary} />
          <View>
            <Text style={styles.title}>{selectedTool.name}</Text>
            <Text style={styles.subtitle}>{selectedTool.description}</Text>
          </View>
        </View>

        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Icon name="sync" size={40} color={COLORS.primary} />
            <Text style={styles.processingText}>Processing your file...</Text>
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={handleFileUpload}>
            <View style={styles.uploadCard}>
              <Icon name="upload" size={40} color={COLORS.primary} />
              <Text style={styles.uploadTitle}>Upload your files</Text>
              <Text style={styles.uploadSubtitle}>Tap here to browse files</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    screenContainer: { flex: 1, padding: 15 },
    header: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: COLORS.text },
    subtitle: { fontSize: 16, color: COLORS.mutedForeground },
    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 5 },
    backButtonText: { color: COLORS.mutedForeground, fontSize: 16 },
    uploadCard: { borderWidth: 2, borderColor: `${COLORS.primary}60`, borderStyle: 'dashed', borderRadius: 16, padding: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: `${COLORS.primary}10` },
    uploadTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 15 },
    uploadSubtitle: { fontSize: 16, color: COLORS.mutedForeground, marginTop: 5 },
    processingContainer: { alignItems: 'center', padding: 40, backgroundColor: COLORS.card, borderRadius: 16 },
    processingText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 20 },
    progressBarBackground: { height: 8, width: '100%', backgroundColor: `${COLORS.primary}30`, borderRadius: 4 },
    progressBar: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
    notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});