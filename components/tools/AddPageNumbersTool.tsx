import { ProcessingCard } from "@/components/ui/ProcessingCard";
import { UploadCard } from "@/components/ui/UploadCard";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export default function AddPageNumbersTool() {
  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("bottom-center");
  const [startPage, setStartPage] = useState("1");
  const [startNumber, setStartNumber] = useState("1");
  const [pageFormat, setPageFormat] = useState("number_only");

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedFile = result.assets[0];
        setFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/pdf",
          size: selectedFile.size,
        });
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a PDF file");
      return;
    }

    const startPageNum = parseInt(startPage, 10);
    const startNumberNum = parseInt(startNumber, 10);

    if (isNaN(startPageNum) || startPageNum < 1) {
      Alert.alert("Error", "Please enter a valid start page number (1 or greater)");
      return;
    }

    if (isNaN(startNumberNum) || startNumberNum < 1) {
      Alert.alert("Error", "Please enter a valid starting number (1 or greater)");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("pdf", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      formData.append("position", position);
      formData.append("startPage", startPageNum.toString());
      formData.append("pageFormat", pageFormat);
      formData.append("startNumber", startNumberNum.toString());
      formData.append("fontColor", "black");

      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/add-page-numbers",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const docDir = FileSystem.documentDirectory;
      const filename = `numbered-${file.name}`;
      const fileUri = `${docDir}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", "Page numbers added successfully!", [
        { text: "OK", style: "default" },
        { text: "Share File", onPress: () => shareFile(fileUri) },
      ]);
    } catch (error) {
      console.error("Processing error:", error);
      Alert.alert(
        "Error",
        "Failed to add page numbers. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async (fileUri: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Info", "File saved to app documents");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Error", "Could not share the PDF file");
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Page Numbers</Text>
      <Text style={styles.subtitle}>Customize and add page numbers to your PDF</Text>

      <UploadCard
        onPress={pickFile}
        title="Select PDF File"
        subtitle="Tap here to browse and select a PDF file"
      />

      {file && (
        <View style={styles.fileCard}>
          <View style={styles.fileHeader}>
            <Text style={styles.fileCardTitle}>Selected File</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeFile}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={2}>
              {file.name}
            </Text>
            <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
          </View>
        </View>
      )}

      {file && (
        <View style={styles.optionsCard}>
          <Text style={styles.cardTitle}>Page Number Settings</Text>

          <View style={styles.optionGroup}>
            <Text style={styles.label}>Position</Text>
            <View style={styles.positionGrid}>
              <TouchableOpacity
                style={[
                  styles.positionButton,
                  position === "top-left" && styles.positionButtonActive,
                ]}
                onPress={() => setPosition("top-left")}
              >
                <Text style={[styles.positionIcon, position === "top-left" && styles.positionIconActive]}>↖</Text>
                <Text style={[styles.positionText, position === "top-left" && styles.positionTextActive]}>Top Left</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.positionButton,
                  position === "top-center" && styles.positionButtonActive,
                ]}
                onPress={() => setPosition("top-center")}
              >
                <Text style={[styles.positionIcon, position === "top-center" && styles.positionIconActive]}>↑</Text>
                <Text style={[styles.positionText, position === "top-center" && styles.positionTextActive]}>Top Center</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.positionButton,
                  position === "top-right" && styles.positionButtonActive,
                ]}
                onPress={() => setPosition("top-right")}
              >
                <Text style={[styles.positionIcon, position === "top-right" && styles.positionIconActive]}>↗</Text>
                <Text style={[styles.positionText, position === "top-right" && styles.positionTextActive]}>Top Right</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.positionButton,
                  position === "bottom-left" && styles.positionButtonActive,
                ]}
                onPress={() => setPosition("bottom-left")}
              >
                <Text style={[styles.positionIcon, position === "bottom-left" && styles.positionIconActive]}>↙</Text>
                <Text style={[styles.positionText, position === "bottom-left" && styles.positionTextActive]}>Bottom Left</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.positionButton,
                  position === "bottom-center" && styles.positionButtonActive,
                ]}
                onPress={() => setPosition("bottom-center")}
              >
                <Text style={[styles.positionIcon, position === "bottom-center" && styles.positionIconActive]}>↓</Text>
                <Text style={[styles.positionText, position === "bottom-center" && styles.positionTextActive]}>Bottom Center</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.positionButton,
                  position === "bottom-right" && styles.positionButtonActive,
                ]}
                onPress={() => setPosition("bottom-right")}
              >
                <Text style={[styles.positionIcon, position === "bottom-right" && styles.positionIconActive]}>↘</Text>
                <Text style={[styles.positionText, position === "bottom-right" && styles.positionTextActive]}>Bottom Right</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.label}>Format</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  pageFormat === "number_only" && styles.formatButtonActive,
                ]}
                onPress={() => setPageFormat("number_only")}
              >
                <Text
                  style={[
                    styles.formatButtonText,
                    pageFormat === "number_only" && styles.formatButtonTextActive,
                  ]}
                >
                  Numbers Only
                </Text>
                <Text style={styles.formatExample}>1, 2, 3...</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  pageFormat === "page_of_total" && styles.formatButtonActive,
                ]}
                onPress={() => setPageFormat("page_of_total")}
              >
                <Text
                  style={[
                    styles.formatButtonText,
                    pageFormat === "page_of_total" && styles.formatButtonTextActive,
                  ]}
                >
                  Page of Total
                </Text>
                <Text style={styles.formatExample}>1 of 10</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.optionGroup, styles.halfWidth]}>
              <Text style={styles.label}>Start from Page</Text>
              <TextInput
                style={styles.input}
                value={startPage}
                onChangeText={setStartPage}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.optionGroup, styles.halfWidth]}>
              <Text style={styles.label}>Starting Number</Text>
              <TextInput
                style={styles.input}
                value={startNumber}
                onChangeText={setStartNumber}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      )}

      {loading ? (
        <ProcessingCard message="Adding page numbers..." progressWidth={50} />
      ) : (
        <TouchableOpacity
          style={[styles.processButton, !file && styles.disabledButton]}
          onPress={handleAddPageNumbers}
          disabled={!file}
        >
          <Text
            style={[
              styles.processButtonText,
              !file && styles.disabledButtonText,
            ]}
          >
            Add Page Numbers
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How it works</Text>
        <Text style={styles.infoText}>
          • Select your PDF file{"\n"}
          • Choose where to place page numbers{"\n"}
          • Pick your preferred format{"\n"}
          • Set starting page and number{"\n"}
          • Download or share your numbered PDF
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  fileCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  fileCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fileDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  fileSize: {
    fontSize: 13,
    color: "#888",
  },
  removeButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
  optionsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  optionGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dropdownContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  positionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  positionButton: {
    width: "31%",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  positionButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  positionIcon: {
    fontSize: 24,
    color: "#333",
    marginBottom: 4,
  },
  positionIconActive: {
    color: "#fff",
  },
  positionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  positionTextActive: {
    color: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  formatButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  formatButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  formatButtonTextActive: {
    color: "#fff",
  },
  formatExample: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#1a1a1a",
  },
  processButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    shadowOpacity: 0,
  },
  processButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButtonText: {
    color: "#999",
  },
  infoCard: {
    backgroundColor: "#e8f4fd",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 22,
  },
});