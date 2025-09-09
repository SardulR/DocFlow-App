import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions, // <-- Import Dimensions
} from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// --- Configuration & Data ---
const COLORS = {
  primary: "#d90429",
  background: "#edf2f4",
  card: "rgba(255, 255, 255, 0.9)",
  text: "#2b2d42",
  mutedForeground: "#8d99ae",
};

const TOOLS = [
   { id: "merge-pdf", name: "Merge PDFs", icon: "file-plus-outline" as const, description: "Combine multiple PDFs", category: "pdf" },
   { id: "split-pdf", name: "Split PDF", icon: "file-document-multiple-outline" as const, description: "Split PDF into pages", category: "pdf" },
   { id: "compress-pdf", name: "Compress PDF", icon: "arrow-collapse" as const, description: "Reduce PDF file size", category: "pdf" },
   { id: "pdf-to-word", name: "PDF to Word", icon: "file-word-outline" as const, description: "Convert PDF to Word", category: "pdf" },
   { id: "word-to-pdf", name: "Word to PDF", icon: "file-word-outline" as const, description: "Convert Word to PDF", category: "docx" },
   { id: "excel-to-pdf", name: "Excel to PDF", icon: "file-excel-outline" as const, description: "Convert Excel to PDF", category: "excel" },
   { id: "pdf-to-excel", name: "PDF to Excel", icon: "file-excel-outline" as const, description: "Convert PDF to Excel", category: "pdf" },
   { id: "image-to-pdf", name: "Image to PDF", icon: "file-image-outline" as const, description: "Convert images to PDF", category: "image" },
   { id: "pdf-to-image", name: "PDF to Image", icon: "file-image-outline" as const, description: "Convert PDF to Image", category: "pdf" },
   { id: "remove-bg", name: "Remove Background", icon: "image-edit-outline" as const, description: "Remove image background", category: "image" },
];

type Tool = (typeof TOOLS)[0];

// --- Main Home Screen Component ---
export default function HomeScreen() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleToolSelect = (tool: Tool) => setSelectedTool(tool);

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
      setSelectedTool(null);
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const renderToolGrid = () => (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.scrollViewContent} // <-- Use new content style
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Icon name="file-document-edit-outline" size={32} color={COLORS.primary} />
        <View>
          <Text style={styles.title}>DocFlow</Text>
          <Text style={styles.subtitle}>Simple, fast, and secure file processing</Text>
        </View>
      </View>
      <View style={styles.toolGridContainer}>
        {TOOLS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.toolCard} onPress={() => handleToolSelect(item)}>
            <View style={styles.toolIconContainer}>
              <Icon name={item.icon} size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.toolName}>{item.name}</Text>
            <Text style={styles.toolDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderToolScreen = () => (
    <ScrollView style={styles.screenContainer}>
      <TouchableOpacity onPress={() => setSelectedTool(null)} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color={COLORS.mutedForeground} />
        <Text style={styles.backButtonText}>Back to Tools</Text>
      </TouchableOpacity>
      <View style={[styles.header, { marginBottom: 30 }]}>
        <Icon name={selectedTool?.icon || 'help'} size={32} color={COLORS.primary} />
        <View>
          <Text style={styles.title}>{selectedTool?.name}</Text>
          <Text style={styles.subtitle}>{selectedTool?.description}</Text>
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
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedTool ? renderToolScreen() : renderToolGrid()}
    </SafeAreaView>
  );
}

// Get the full width of the screen
const { width } = Dimensions.get('window');

const screenPadding = 15;

const cardGap = 10;

const cardWidth = (width - (screenPadding * 2) - cardGap) / 2;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    screenContainer: { flex: 1, paddingHorizontal: screenPadding, paddingTop: 15 }, // Use paddingHorizontal here
    scrollViewContent: {
      paddingBottom: 70, // Adjust this to ensure content clears the tab bar
    },
    header: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: COLORS.text },
    subtitle: { fontSize: 16, color: COLORS.mutedForeground },
    toolGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', 
        marginHorizontal: -cardGap / 2, 
    },
    toolCard: {
        width: cardWidth, 
        minHeight: 160, 
        marginBottom: cardGap,
        marginHorizontal: cardGap / 2, 
        padding: 15, 
        backgroundColor: COLORS.card,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    toolIconContainer: { padding: 12, backgroundColor: `${COLORS.primary}20`, borderRadius: 12, marginBottom: 12 },
    toolName: { fontSize: 16, fontWeight: "bold", color: COLORS.text, textAlign: "center" },
    toolDescription: { fontSize: 12, color: COLORS.mutedForeground, textAlign: "center", marginTop: 4 },
    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 5 },
    backButtonText: { color: COLORS.mutedForeground, fontSize: 16 },
    uploadCard: { borderWidth: 2, borderColor: `${COLORS.primary}60`, borderStyle: 'dashed', borderRadius: 16, padding: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: `${COLORS.primary}10` },
    uploadTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 15 },
    uploadSubtitle: { fontSize: 16, color: COLORS.mutedForeground, marginTop: 5 },
    processingContainer: { alignItems: 'center', padding: 40, backgroundColor: COLORS.card, borderRadius: 16 },
    processingText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 20 },
    progressBarBackground: { height: 8, width: '100%', backgroundColor: `${COLORS.primary}30`, borderRadius: 4 },
    progressBar: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
});