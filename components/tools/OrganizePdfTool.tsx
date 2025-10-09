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

interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export default function OrganizePdfTool() {
  const [file, setFile] = useState<FileItem | null>(null);
  const [pageOrder, setPageOrder] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  const handleOrganize = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a PDF file to organize");
      return;
    }

    if (!pageOrder.trim()) {
      Alert.alert("Error", "Please specify the new page order");
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

      formData.append("newOrder", pageOrder.trim());

      const response = await fetch(
        "https://docflow-backend-q83c.onrender.com/api/organize-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Get the PDF as blob, then convert to base64
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

      // Save the file using FileSystem.documentDirectory
      const docDir = FileSystem.documentDirectory;
      const filename = "organized.pdf";
      const fileUri = `${docDir}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", "PDF pages organized successfully!", [
        { text: "OK", style: "default" },
        { text: "Share File", onPress: () => shareFile(fileUri) },
      ]);
    } catch (error: any) {
      console.error("Organize error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to organize PDF. Please check your internet connection and try again."
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
      Alert.alert("Error", "Could not share the organized PDF file");
    }
  };

  const removeFile = () => {
    setFile(null);
    setPageOrder('');
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PDF Organize Tool</Text>

      <UploadCard
        onPress={pickFile}
        title="Select PDF File"
        subtitle="Tap here to browse and select a PDF file"
      />

      {file && (
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>Selected File:</Text>
          <View style={styles.fileItem}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name}
              </Text>
              <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeFile}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {file && (
        <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>New Page Order:</Text>
          <Text style={styles.orderHelp}>
            Enter the new order of pages separated by commas
          </Text>
          
          <TextInput
            style={styles.orderInput}
            placeholder="e.g., 3, 1, 2, 4, 5"
            value={pageOrder}
            onChangeText={setPageOrder}
            multiline
          />

          <View style={styles.exampleBox}>
            <Text style={styles.exampleTitle}>Example:</Text>
            <Text style={styles.exampleText}>
              If your PDF has 5 pages and you want to reorder them as:{"\n"}
              Page 3 → Page 1 → Page 2 → Page 5 → Page 4{"\n\n"}
              Enter: <Text style={styles.exampleValue}>3, 1, 2, 5, 4</Text>
            </Text>
          </View>
        </View>
      )}

      {loading ? (
        <ProcessingCard message="Organizing PDF pages..." progressWidth={50} />
      ) : (
        <TouchableOpacity
          style={[styles.organizeButton, (!file || !pageOrder.trim()) && styles.disabledButton]}
          onPress={handleOrganize}
          disabled={!file || !pageOrder.trim()}
        >
          <Text
            style={[
              styles.organizeButtonText,
              (!file || !pageOrder.trim()) && styles.disabledButtonText,
            ]}
          >
            Organize PDF Pages
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Select a PDF file to reorganize{"\n"}
          • Enter the new page order using comma-separated numbers{"\n"}
          • Each page number must appear exactly once{"\n"}
          • Page numbers start from 1{"\n"}
          • Example: For a 4-page PDF, enter &quot;3, 1, 4, 2&quot; to reorder
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  fileList: {
    marginVertical: 20,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orderSection: {
    marginVertical: 20,
  },
  orderHelp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
    fontStyle: "italic",
  },
  orderInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: "top",
  },
  exampleBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff9e6",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  exampleValue: {
    fontWeight: "600",
    color: "#007AFF",
  },
  organizeButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  organizeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#999",
  },
  instructions: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e8f4f8",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});